import React from 'react'; // ✅ Required

export default function CoverPreviewCorporate({ data }) {
  return (
    <>
      <style>
        {`
          .bg-white { background-color: #ffffff !important; }
          .text-gray-900 { color: #111827 !important; }

          body, div, p, h1 {
            line-height: 1.5 !important;
            font-family: 'Times New Roman', serif !important;
            -webkit-font-smoothing: antialiased !important;
          }
        `}
      </style>

      <div className="w-[8.5in] min-h-[11in] bg-white px-12 py-10 font-serif text-gray-900">
        <header className="mb-6 text-sm leading-relaxed">
          <p>{data.name}</p>
          <p>{data.email}</p>
          <p>{data.phone}</p>
          <p>{data.address}</p>
        </header>

        <section className="mb-4 text-sm leading-relaxed">
          <p>{new Date().toLocaleDateString()}</p>
          <p className="font-semibold mt-2">{data.company}</p>
          <p>Hiring Manager</p>
        </section>

        <section className="text-sm mt-4 text-justify leading-7">
          <p>{data.message}</p>
        </section>

        <footer className="mt-8 text-sm leading-relaxed">
          <p>Sincerely,</p>
          <p className="mt-2">{data.name}</p>
        </footer>
      </div>
    </>
  );
}
