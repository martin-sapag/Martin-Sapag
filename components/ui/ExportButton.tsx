import React, { useState, useEffect, useRef } from 'react';

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);


interface ExportButtonProps {
  onExportCsv: () => void;
  onExportPdf: () => void;
  disabled: boolean;
  label: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExportCsv, onExportPdf, disabled, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  const handlePdfClick = () => {
      onExportPdf();
      setIsOpen(false);
  }

  const handleCsvClick = () => {
      onExportCsv();
      setIsOpen(false);
  }

  return (
    <div className="relative inline-block text-left w-full" ref={wrapperRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:cursor-not-allowed"
          disabled={disabled}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <DownloadIcon />
          {label}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <button
              onClick={handlePdfClick}
              className="text-slate-200 block w-full text-left px-4 py-2 text-sm hover:bg-slate-600"
              role="menuitem"
            >
              Exportar como PDF
            </button>
            <button
              onClick={handleCsvClick}
              className="text-slate-200 block w-full text-left px-4 py-2 text-sm hover:bg-slate-600"
              role="menuitem"
            >
              Exportar como CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;