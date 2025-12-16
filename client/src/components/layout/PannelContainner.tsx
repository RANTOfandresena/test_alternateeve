import { type ReactNode } from "react";
import { X } from "lucide-react";

type PanelContainerProps = {
    title?:string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

const PanelContainer = ({ title="Pannel",isOpen, onClose, children }: PanelContainerProps) => {
  return (
    <>
      {/* Overlay sombre */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300  ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white z-3 shadow-2xl p-6 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Contenu */}
        <div className="overflow-y-auto h-[calc(100%-56px)]">{children}</div>
      </div>
    </>
  );
};

export default PanelContainer;