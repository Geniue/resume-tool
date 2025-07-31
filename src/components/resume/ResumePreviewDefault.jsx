import React from 'react'; // ✅ Required

export default function ResumePreview({ data }) {
  return (
    <div className="bg-white font-sans w-[8.5in] min-h-[11in] border shadow print:shadow-none print:border-0">
      {/* Header */}
      <div className="bg-blue-700 text-white p-6 print:bg-blue-700 print:text-white">
        <h1 className="text-4xl font-bold">{data.name || "Your Name"}</h1>
        <p className="text-lg">{data.title}</p>
      </div>

      {/* Main */}
      <div className="grid grid-cols-3 gap-4 p-6 print:p-4">
        {/* Sidebar */}
        <div className="col-span-1 pr-4 border-r print:border-r-2 print:border-gray-200">
          <h3 className="font-bold mb-2 text-blue-700 print:text-blue-700">Contact</h3>
          <p className="mb-1">{data.email}</p>
          <p className="mb-1">{data.phone}</p>
          <p className="mb-4">{data.address}</p>

          <h3 className="font-bold mt-4 mb-2 text-blue-700 print:text-blue-700">Skills</h3>
          <ul className="list-disc ml-5 text-sm space-y-1">
            {data.skills?.split(",").map((skill, i) => (
              <li key={i}>{skill.trim()}</li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-span-2 pl-4">
          <h3 className="font-bold mb-2 text-blue-700 print:text-blue-700">Summary</h3>
          <p className="mb-4 text-justify">{data.summary}</p>

          <h3 className="font-bold mb-2 text-blue-700 print:text-blue-700">Experience</h3>
          <div className="mb-4 whitespace-pre-line">{data.experience}</div>

          <h3 className="font-bold mb-2 text-blue-700 print:text-blue-700">Education</h3>
          <div className="whitespace-pre-line">{data.education}</div>
        </div>
      </div>
    </div>
  );
}