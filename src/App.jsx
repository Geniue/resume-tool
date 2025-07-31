import { useState, useRef } from "react";
import './ResumeStyles.css';

import ResumePreviewDefault from "./components/resume/ResumePreviewDefault";
import ResumePreviewModern from "./components/resume/ResumePreviewModern";
import ResumePreviewMinimal from "./components/resume/ResumePreviewMinimal";

import CoverPreviewDefault from "./components/cover/CoverPreviewDefault";
import CoverPreviewCorporate from "./components/cover/CoverPreviewCorporate";
import CoverPreviewCreative from "./components/cover/CoverPreviewCreative";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const [activeTab, setActiveTab] = useState("resume");
  const previewRef = useRef(null);

  const [resumeTemplate, setResumeTemplate] = useState("default");
  const [coverTemplate, setCoverTemplate] = useState("default");

  const [resumeData, setResumeData] = useState({
    name: "John Doe",
    title: "Software Engineer",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    address: "123 Main St, City, State 10001",
    summary: "Experienced software engineer with 5+ years in web development.",
    experience: "Senior Developer at Tech Corp (2020-Present)\n- Led team of 5 developers\n- Implemented new features",
    education: "B.S. Computer Science, University (2015-2019)",
    skills: "JavaScript, React, Node.js, Python, SQL",
  });

  const [coverData, setCoverData] = useState({
    name: "John Doe",
    jobTitle: "Senior Software Engineer",
    company: "Innovative Tech Solutions",
    message: "I'm excited to apply for this position because...",
  });

  const handleDownload = async () => {
    try {
      const element = previewRef.current;
      if (!element) throw new Error("Preview element not found");

      const canvas = await html2canvas(element, {
        scale: 2, // Higher for better quality, not size
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // Create PDF at standard A4 or Letter size (you can adjust this)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4", // or [595.28, 841.89] for A4 manually
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Compute scaled image size to fit the page with margin
      const margin = 20;
      const scaleFactor = Math.min(
        (pageWidth - margin * 2) / canvas.width,
        (pageHeight - margin * 2) / canvas.height
      );

      const imgWidth = canvas.width * scaleFactor;
      const imgHeight = canvas.height * scaleFactor;

      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      pdf.save(`${activeTab}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Error generating PDF: " + err.message);
    }
  };


  const resumeTemplates = {
    default: ResumePreviewDefault,
    modern: ResumePreviewModern,
    minimal: ResumePreviewMinimal,
  };

  const coverTemplates = {
    default: CoverPreviewDefault,
    corporate: CoverPreviewCorporate,
    creative: CoverPreviewCreative,
  };

  const ResumeComponent = resumeTemplates[resumeTemplate];
  const CoverComponent = coverTemplates[coverTemplate];

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      {/* Header */}
      <div className="max-w-6xl mx-auto bg-white p-4 rounded-xl shadow-md mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Resume & Cover Letter Builder</h1>
        <div>
          <button
            className={`px-4 py-2 mx-1 rounded ${activeTab === "resume" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("resume")}
          >
            Resume
          </button>
          <button
            className={`px-4 py-2 mx-1 rounded ${activeTab === "cover" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("cover")}
          >
            Cover Letter
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sidebar: Templates + Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            {activeTab === "resume" ? "Resume Details" : "Cover Letter Details"}
          </h2>

          {/* Template Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              {activeTab === "resume" ? "Choose Resume Template" : "Choose Cover Letter Template"}
            </h3>

            {/* Resume */}
            {activeTab === "resume" && (
              <div className="grid grid-cols-3 gap-4">
                {["default", "modern", "minimal"].map((template) => (
                  <button
                    key={template}
                    onClick={() => setResumeTemplate(template)}
                    className={`border rounded-lg p-4 text-center transition-all ${
                      resumeTemplate === template ? "border-blue-600 ring-2 ring-blue-300 bg-blue-50" : "border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-sm mb-1 capitalize">{template}</div>
                    <div className="w-28 h-36 overflow-hidden border rounded">
                      <iframe
                        src={`/preview/resume/${template}.html`}
                        title={`Resume preview ${template}`}
                        className="w-[300px] h-[390px] scale-[0.37] origin-top-left pointer-events-none"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Cover */}
            {activeTab === "cover" && (
              <div className="grid grid-cols-3 gap-4">
                {["default", "corporate", "creative"].map((template) => (
                  <button
                    key={template}
                    onClick={() => setCoverTemplate(template)}
                    className={`border rounded-lg p-4 text-center transition-all ${
                      coverTemplate === template ? "border-blue-600 ring-2 ring-blue-300 bg-blue-50" : "border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-sm mb-1 capitalize">{template}</div>
                    <div className="w-28 h-36 overflow-hidden border rounded">
                      <iframe
                        src={`/preview/cover/${template}.html`}
                        title={`Cover preview ${template}`}
                        className="w-[300px] h-[390px] scale-[0.37] origin-top-left pointer-events-none"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Forms */}
          {(activeTab === "resume" ? resumeData : coverData) &&
            Object.entries(activeTab === "resume" ? resumeData : coverData).map(([key, value]) => (
              <div key={key} className="mb-3">
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                {key === "message" || ["summary", "experience", "education"].includes(key) ? (
                  <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    value={value}
                    onChange={(e) =>
                      activeTab === "resume"
                        ? setResumeData({ ...resumeData, [key]: e.target.value })
                        : setCoverData({ ...coverData, [key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={value}
                    onChange={(e) =>
                      activeTab === "resume"
                        ? setResumeData({ ...resumeData, [key]: e.target.value })
                        : setCoverData({ ...coverData, [key]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}

          <button
            onClick={handleDownload}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Download {activeTab === "resume" ? "Resume" : "Cover Letter"}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-lg overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <div ref={previewRef}>
            {activeTab === "resume" ? (
              <ResumeComponent data={resumeData} />
            ) : (
              <CoverComponent data={coverData} />
            )}
          </div>
        </div>
        

        
      </div>
      {/* Donation Section */}
      <div className="max-w-6xl mx-auto mt-10 text-center">
        <h2 className="text-lg font-semibold mb-4">ادعمني لدعم استمرار الأداة ❤️</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          {/* Vodafone Cash Button */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <p className="mb-2 text-sm text-gray-700">📱 دعم عبر فودافون كاش</p>
            <p className="font-semibold text-lg text-red-600">01017910660</p>
            <p className="text-xs text-gray-500 mt-1">أي مبلغ صغير يساعد، حتى ٥ جنيه 🙏</p>
          </div>

          {/* Buy Me a Coffee Button */}
          <a
            href="https://www.buymeacoffee.com/mostafahana" // عدل هذا بالرابط الخاص بك
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl shadow-md transition duration-300"
          >
            ☕ Buy Me a Coffee
          </a>
        </div>
      </div>

    </div>
  );
}
