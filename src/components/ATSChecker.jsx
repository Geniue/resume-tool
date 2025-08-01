import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, AlertTriangle, XCircle, Target, Zap, Eye, Upload, File } from 'lucide-react';
import * as mammoth from 'mammoth';

const ATSScoreChecker = ({ resumeText = "" }) => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedText, setUploadedText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const extractTextFromPDF = async (file) => {
    try {
      setUploadStatus("Extracting text from PDF...");
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('PDF file is too large (max 5MB). Please use a smaller file.');
      }

      // Dynamically import PDF.js
      const pdfjsLib = await import('pdfjs-dist/build/pdf');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      // Read the file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document with error handling
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        disableFontFace: true, // Improves performance
        disableAutoFetch: true // Reduces memory usage
      }).promise;
      
      let fullText = '';
      const maxPages = 5; // Limit to first 5 pages for performance
      
      // Extract text from each page
      for (let i = 1; i <= Math.min(pdf.numPages, maxPages); i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map(item => item.str)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          fullText += pageText + '\n\n';
        } catch (pageError) {
          console.warn(`Error extracting text from page ${i}:`, pageError);
          continue;
        }
      }
      
      // Clean the extracted text while preserving important resume elements
      const cleanText = fullText
        .replace(/[^\w\s@.,\-/#+()\n:]/g, ' ') // Keep common resume characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      if (cleanText.length < 100) {
        throw new Error('PDF text extraction was incomplete. The file may be image-based. Try saving as DOCX or paste text manually.');
      }
      
      return cleanText;
      
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(`PDF processing failed: ${error.message}`);
    }
  };

  const extractTextFromDOCX = async (file) => {
    try {
      setUploadStatus("Extracting text from DOCX...");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      if (!result.value || result.value.trim().length < 50) {
        throw new Error('Document appears to be empty or could not be read.');
      }
      
      return result.value;
    } catch (error) {
      console.error('DOCX extraction error:', error);
      throw new Error(`DOCX processing failed: ${error.message}`);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setUploadStatus("Processing file...");
      setIsAnalyzing(true);
      
      let extractedText = "";
      const fileType = file.type;

      if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await extractTextFromDOCX(file);
      } else if (fileType === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else {
        throw new Error('Unsupported file type. Please upload DOCX or PDF files.');
      }

      if (extractedText.trim().length < 100) {
        throw new Error('Could not extract enough text from the file. Try copying and pasting the text instead.');
      }

      setUploadedText(extractedText);
      setUploadStatus(`✅ Successfully extracted text (${extractedText.length} chars)`);
      
      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(""), 3000);
      
    } catch (error) {
      console.error('File processing error:', error);
      setUploadStatus(`❌ ${error.message}`);
      setTimeout(() => setUploadStatus(""), 5000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const analyzeResume = (text) => {
    setIsAnalyzing(true);
    
    const analysis = {
      score: 0,
      feedback: [],
      categories: {
        formatting: 0,
        keywords: 0,
        structure: 0,
        content: 0
      }
    };

    // Formatting Checks
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text);
    const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
    const hasBulletPoints = /[•·‣⁃-]\s/.test(text) || /^\s*[\*\-]\s/m.test(text);
    
    if (hasEmail) {
      analysis.score += 10;
      analysis.categories.formatting += 25;
      analysis.feedback.push({
        type: 'success',
        category: 'Contact Info',
        message: 'Email address found - good for ATS systems'
      });
    } else {
      analysis.feedback.push({
        type: 'error',
        category: 'Contact Info',
        message: 'Missing email address - ATS systems need contact information'
      });
    }

    if (hasPhone) {
      analysis.score += 10;
      analysis.categories.formatting += 25;
      analysis.feedback.push({
        type: 'success',
        category: 'Contact Info',
        message: 'Phone number found - good for recruiters'
      });
    } else {
      analysis.feedback.push({
        type: 'warning',
        category: 'Contact Info',
        message: 'Consider adding a phone number for better contact'
      });
    }

    // Structure Checks
    const sections = ['experience', 'education', 'skills', 'work', 'employment', 'summary', 'projects'];
    const foundSections = sections.filter(section => 
      new RegExp(`\\b${section}\\b`, 'i').test(text)
    );
    
    if (foundSections.length >= 3) {
      analysis.score += 20;
      analysis.categories.structure += 70;
      analysis.feedback.push({
        type: 'success',
        category: 'Structure',
        message: `Excellent! Found ${foundSections.length} key sections: ${foundSections.join(', ')}`
      });
    } else if (foundSections.length >= 2) {
      analysis.score += 10;
      analysis.categories.structure += 40;
      analysis.feedback.push({
        type: 'warning',
        category: 'Structure',
        message: `Found ${foundSections.length} sections. Consider adding more sections like "Summary" or "Projects"`
      });
    } else {
      analysis.feedback.push({
        type: 'error',
        category: 'Structure',
        message: 'Add clear section headers like "Experience", "Education", "Skills"'
      });
    }

    // Keywords & Action Verbs
    const actionVerbs = [
      'achieved', 'created', 'developed', 'implemented', 'managed', 'led', 'designed',
      'built', 'optimized', 'increased', 'improved', 'delivered', 'launched', 'established',
      'spearheaded', 'transformed', 'initiated', 'coordinated', 'executed', 'mentored'
    ];
    
    const foundVerbs = actionVerbs.filter(verb => 
      new RegExp(`\\b${verb}\\b`, 'i').test(text)
    );
    
    if (foundVerbs.length >= 8) {
      analysis.score += 25;
      analysis.categories.keywords += 80;
      analysis.feedback.push({
        type: 'success',
        category: 'Keywords',
        message: `Excellent! Found ${foundVerbs.length} strong action verbs`
      });
    } else if (foundVerbs.length >= 4) {
      analysis.score += 15;
      analysis.categories.keywords += 50;
      analysis.feedback.push({
        type: 'warning',
        category: 'Keywords',
        message: `Good start with ${foundVerbs.length} action verbs. Try adding more like: ${actionVerbs.slice(0, 5).join(', ')}`
      });
    } else {
      analysis.feedback.push({
        type: 'error',
        category: 'Keywords',
        message: 'Use more action verbs like: developed, managed, achieved, implemented'
      });
    }

    // Content Quality
    const wordCount = text.trim().split(/\s+/).length;
    const hasQuantifiableResults = /\d+%|\$\d+|\d+\+|\d+\s*(years|months|days)|increased by|reduced by|saved\s+\$?\d+/i.test(text);
    
    if (wordCount >= 300) {
      analysis.score += 15;
      analysis.categories.content += 50;
      analysis.feedback.push({
        type: 'success',
        category: 'Content',
        message: 'Good content length with sufficient details'
      });
    } else if (wordCount >= 200) {
      analysis.score += 10;
      analysis.categories.content += 30;
      analysis.feedback.push({
        type: 'warning',
        category: 'Content',
        message: 'Resume could use more details about your achievements'
      });
    } else {
      analysis.feedback.push({
        type: 'error',
        category: 'Content',
        message: 'Resume seems too short. Add more details about your roles and accomplishments'
      });
    }

    if (hasQuantifiableResults) {
      analysis.score += 20;
      analysis.categories.content += 60;
      analysis.feedback.push({
        type: 'success',
        category: 'Content',
        message: 'Great! Found quantifiable results - ATS systems love metrics'
      });
    } else {
      analysis.feedback.push({
        type: 'warning',
        category: 'Content',
        message: 'Add numbers & metrics like "increased efficiency by 25%" or "managed $500K budget"'
      });
    }

    // Bullet Points
    if (hasBulletPoints) {
      analysis.score += 10;
      analysis.categories.formatting += 25;
      analysis.feedback.push({
        type: 'success',
        category: 'Formatting',
        message: 'Good use of bullet points - easy for ATS to parse'
      });
    } else {
      analysis.feedback.push({
        type: 'warning',
        category: 'Formatting',
        message: 'Use bullet points (• or *) for better ATS readability'
      });
    }

    // Final scoring adjustments
    analysis.categories.formatting = Math.min(100, analysis.categories.formatting);
    analysis.categories.keywords = Math.min(100, analysis.categories.keywords);
    analysis.categories.structure = Math.min(100, analysis.categories.structure);
    analysis.categories.content = Math.min(100, analysis.categories.content);

    // Ensure score is between 0-100
    analysis.score = Math.max(0, Math.min(100, analysis.score));

    setScore(analysis.score);
    setFeedback(analysis.feedback);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    const textToAnalyze = uploadedText || resumeText;
    if (textToAnalyze && textToAnalyze.length > 100) {
      analyzeResume(textToAnalyze);
    }
  }, [resumeText, uploadedText]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getFeedbackIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">ATS Score Checker</h2>
        </div>
        <p className="text-gray-600">
          Upload your resume file or paste text to get analyzed for Applicant Tracking System compatibility.
        </p>
      </div>

      {/* File Upload Section */}
      <div className="mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload Resume File
          </h3>
          <p className="text-gray-500 mb-4">
            Drag and drop your <strong>PDF or DOCX</strong> file here, or click to select<br/>
            <span className="text-xs text-gray-400">Max file size: 5MB</span>
          </p>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition"
          >
            <File className="w-4 h-4" />
            Choose File
          </label>
          
          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              uploadStatus.includes('❌') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : uploadStatus.includes('✅')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {uploadStatus}
            </div>
          )}
        </div>

        <div className="text-center my-4">
          <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-500 text-sm">
            OR
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste Resume Text
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
            placeholder="Paste your resume text here for analysis..."
            value={uploadedText}
            onChange={(e) => setUploadedText(e.target.value)}
          />
        </div>
      </div>

      {/* Score Display */}
      <div className="mb-8">
        <div className="relative">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${score * 2.51} 251`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'} />
                    <stop offset="100%" stopColor={score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626'} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                    {isAnalyzing ? "..." : score}
                  </div>
                  <div className="text-sm text-gray-500">ATS Score</div>
                </div>
              </div>
            </div>
          </div>
          
          {isAnalyzing && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Zap className="w-5 h-5 animate-pulse" />
              <span>Analyzing your resume...</span>
            </div>
          )}
        </div>
      </div>

      {/* Feedback List */}
      {feedback.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-600" />
            ATS Analysis Results
          </h3>
          <div className="space-y-3">
            {feedback.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  item.type === 'success'
                    ? 'bg-green-50 border-green-500'
                    : item.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getFeedbackIcon(item.type)}
                  <div>
                    <div className="font-medium text-gray-800">{item.category}</div>
                    <div className="text-gray-600 mt-1">{item.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Pro Tips for Higher ATS Scores</h3>
        <ul className="space-y-2 text-blue-700">
          <li>• Use standard section headers like "Experience", "Education", "Skills"</li>
          <li>• Include relevant keywords from the job description</li>
          <li>• Start bullet points with strong action verbs</li>
          <li>• Add quantifiable results and metrics (numbers, percentages, $ amounts)</li>
          <li>• Keep formatting simple and avoid tables, columns, or graphics</li>
          <li>• Save as PDF to preserve formatting</li>
          <li>• Aim for 300-500 words for optimal length</li>
        </ul>
      </div>

      {!resumeText && !uploadedText && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Upload a resume file or paste text above to get started with ATS analysis</p>
        </div>
      )}
    </div>
  );
};

export default ATSScoreChecker;