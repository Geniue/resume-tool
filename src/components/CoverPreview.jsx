export default function CoverPreview({ data }) {
  return (
    <div className="bg-white p-6 font-serif w-[8.5in] min-h-[11in] border shadow print:shadow-none print:border-0">
      <div className="mb-8">
        <p>{new Date().toLocaleDateString()}</p>
        <p>{data.company}</p>
      </div>

      <h1 className="text-xl font-bold mt-4">Dear Hiring Manager,</h1>
      
      <div className="mt-6 space-y-4">
        <p>
          I am {data.name || "Your Name"}, applying for the position of {data.jobTitle || "Position"} at{" "}
          {data.company || "Company Name"}.
        </p>
        
        <p className="whitespace-pre-line">
          {data.message || "Your cover letter message..."}
        </p>
      </div>

      <div className="mt-8">
        <p>Sincerely,</p>
        <p>{data.name || "Your Name"}</p>
      </div>
    </div>
  );
}