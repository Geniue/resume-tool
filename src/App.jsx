// ... imports unchanged
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
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

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
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 font-sans text-gray-800 overflow-x-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-center sm:text-left">Resume & Cover Letter Builder</h1>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded ${activeTab === "resume" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("resume")}
          >
            Resume
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "cover" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("cover")}
          >
            Cover Letter
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sidebar */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            {activeTab === "resume" ? "Resume Details" : "Cover Letter Details"}
          </h2>

          {/* Template Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              {activeTab === "resume" ? "Choose Resume Template" : "Choose Cover Letter Template"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(activeTab === "resume" ? ["default", "modern", "minimal"] : ["default", "corporate", "creative"]).map(
                (template) => (
                  <button
                    key={template}
                    onClick={() =>
                      activeTab === "resume" ? setResumeTemplate(template) : setCoverTemplate(template)
                    }
                    className={`border rounded-lg p-2 text-center transition-all ${
                      (activeTab === "resume" ? resumeTemplate : coverTemplate) === template
                        ? "border-blue-600 ring-2 ring-blue-300 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-sm mb-1 capitalize">{template}</div>
                    <div className="relative w-full aspect-[3/4] overflow-hidden border rounded bg-white">
                      <div className="absolute top-0 left-0 w-full h-full scale-[0.28] origin-top-left pointer-events-none">
                        <iframe
                          src={`/preview/${activeTab}/${template}.html`}
                          title={`${activeTab} preview ${template}`}
                          className="w-[800px] h-[1000px] border-0"
                        />
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Inputs */}
          {(activeTab === "resume" ? resumeData : coverData) &&
            Object.entries(activeTab === "resume" ? resumeData : coverData).map(([key, value]) => (
              <div key={key} className="mb-3">
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                {["summary", "experience", "education", "message"].includes(key) ? (
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

        {/* Preview + Donations */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-lg font-semibold mb-4 text-center">Preview</h2>
          <div className="w-full overflow-hidden">
            <div className="relative w-full overflow-auto">
              <div
                className="mx-auto origin-top transform scale-[0.28] sm:scale-[0.4] md:scale-[0.5] lg:scale-[0.75] xl:scale-100"
                style={{ width: "800px" }}
                ref={previewRef}
              >
                {activeTab === "resume" ? (
                  <ResumeComponent data={resumeData} />
                ) : (
                  <CoverComponent data={coverData} />
                )}
              </div>
            </div>
          </div>

          {/* Donate Section */}
          <div className="mt-10 w-full text-center">
            <p className="mb-2 text-sm text-gray-600 font-medium">
              If you like the tool and want to support scaling it ❤️
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-gray-700 font-semibold">Vodafone Cash</span>
                <span className="text-gray-800">01017910660</span>
              </div>
              <a
                href="https://www.buymeacoffee.com/mostafahana"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition"
              >
                ☕ Buy Me a Coffee
              </a>
            </div>
            <p className="text-xs mt-3 text-gray-500">Even 5 EGP or 50 cents helps 💙</p>
          </div>
        </div>

      </div>
    </div>
  );
}
