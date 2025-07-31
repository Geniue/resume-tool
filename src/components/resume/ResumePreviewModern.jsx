import React from 'react'; // ✅ Required

export default function ResumePreviewModern({ data }) {
  return (
    <>
      <style>
        {`
          .bg-white { background-color: #ffffff !important; }
          .text-gray-900 { color: #111827 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-blue-700 { color: #1d4ed8 !important; }
          .border-blue-500 { border-color: #3b82f6 !important; }
          .border-blue-300 { border-color: #93c5fd !important; }

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
            margin-bottom: 1.25rem;
          }

          section h2 {
            font-size: 1.25rem;
            font-weight: 600;
            border-bottom: 1px solid #93c5fd;
            padding-bottom: 0.25rem;
            color: #1d4ed8;
          }

          section p {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            text-align: justify;
          }

          ul.skills-list {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            list-style: disc;
            padding-left: 1.25rem;
          }

          ul.skills-list li {
            margin-bottom: 0.25rem;
          }
        `}
      </style>

      <div className="bg-white w-[8.5in] min-h-[11in] px-10 py-8 text-gray-900 border-l-8 border-blue-500 font-sans">
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>{data.name}</h1>
          <p style={{ fontSize: '1.125rem', color: '#1d4ed8' }}>{data.title}</p>
          <div style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.5rem' }}>
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
