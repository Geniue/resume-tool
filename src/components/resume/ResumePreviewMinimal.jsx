import React from 'react'; // ✅ Required

export default function ResumePreviewMinimal({ data }) {
  return (
    <>
      <style>
        {`
          .bg-white { background-color: #ffffff !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-500 { color: #6b7280 !important; }
          .border-b { border-bottom: 1px solid #e5e7eb !important; }

          body, div, p, li, h1, h2, h3, pre {
            line-height: 1.5 !important;
            font-family: 'Arial', sans-serif !important;
            -webkit-font-smoothing: antialiased !important;
          }

          pre {
            white-space: pre-wrap;
            margin-top: 0.5rem;
            font-size: 0.875rem;
          }

          section {
            margin-bottom: 1.5rem;
          }

          section h2 {
            font-size: 1.125rem;
            font-weight: 600;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 0.25rem;
            color: #374151;
            text-transform: uppercase;
          }

          section p {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            text-align: justify;
          }

          ul.skills-list {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem 1rem;
            list-style: none;
            padding-left: 0;
          }

          ul.skills-list li::before {
            content: "• ";
          }
        `}
      </style>

      <div className="bg-white w-[8.5in] min-h-[11in] p-10 text-gray-800 font-light">
        <header style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600 }}>{data.name}</h1>
          <p style={{ fontSize: '1rem' }}>{data.title}</p>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            <p>{data.email} | {data.phone}</p>
            <p>{data.address}</p>
          </div>
        </header>

        <section>
          <h2>Summary</h2>
          <p>{data.summary}</p>
        </section>

        <section>
          <h2>Experience</h2>
          <pre>{data.experience}</pre>
        </section>

        <section>
          <h2>Education</h2>
          <pre>{data.education}</pre>
        </section>

        <section>
          <h2>Skills</h2>
          <ul className="skills-list">
            {data.skills?.split(",").map((skill, i) => (
              <li key={i}>{skill.trim()}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
