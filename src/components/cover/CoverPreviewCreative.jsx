import React from 'react'; // ✅ Required

export default function CoverPreviewCreative({ data }) {
  return (
    <>
      <style>
        {`
          /* Reset & compatibility styles */
          .bg-white { background-color: #ffffff !important; }
          .text-gray-900 { color: #111827 !important; }
          .text-blue-700 { color: #1d4ed8 !important; }

          body, div, p, h1 {
            line-height: 1.5 !important;
            font-family: 'Arial', sans-serif !important;
            -webkit-font-smoothing: antialiased !important;
          }

          .shadow {
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
        `}
      </style>

      <div
        className="w-[8.5in] min-h-[11in] bg-white p-12 font-sans text-gray-900"
        style={{ backgroundColor: '#f0f4ff' }}
      >
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1d4ed8' }}>
            {data.name}
          </h1>
          <p style={{ fontStyle: 'italic' }}>{data.jobTitle}</p>
        </header>

        <section
          style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            textAlign: 'left',
          }}
        >
          <p>{data.message}</p>
        </section>

        <footer
          style={{
            marginTop: '2rem',
            fontSize: '0.875rem',
            textAlign: 'right',
          }}
        >
          <p>Warm regards,</p>
          <p style={{ marginTop: '0.25rem', fontWeight: 500 }}>{data.name}</p>
        </footer>
      </div>
    </>
  );
}
