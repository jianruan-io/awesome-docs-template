import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, X } from 'lucide-react';

interface MermaidDiagramProps {
  id: string;
  chart: string;
  maxHeight?: number; // Maximum height in pixels (default: 600)
}

// Cache mermaid instance to avoid re-importing
let mermaidInstance: any = null;

export default function MermaidDiagram({ id, chart, maxHeight = 600 }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fullscreenSvgRef = useRef<SVGSVGElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  // Normal view state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenScale, setFullscreenScale] = useState(1);
  const [fullscreenPosition, setFullscreenPosition] = useState({ x: 0, y: 0 });
  const [isFullscreenDragging, setIsFullscreenDragging] = useState(false);
  const [fullscreenDragStart, setFullscreenDragStart] = useState({ x: 0, y: 0 });
  
  // Common state
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [renderedSvg, setRenderedSvg] = useState<string>('');
  const [containerWidth, setContainerWidth] = useState(0);
  const [mermaidReady, setMermaidReady] = useState(false);

  // Initialize mermaid once
  useEffect(() => {
    const initMermaid = async () => {
      if (!mermaidInstance) {
        try {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            themeVariables: {
              fontFamily: 'system-ui, -apple-system, sans-serif',
            },
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
              curve: 'basis'
            },
            securityLevel: 'loose',
          });
          mermaidInstance = mermaid;
          setMermaidReady(true);
        } catch (err) {
          console.error('Failed to initialize mermaid:', err);
          setError('Failed to load diagram library');
        }
      } else {
        setMermaidReady(true);
      }
    };
    
    initMermaid();
  }, []);

  // Setup ResizeObserver to track container width changes
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateContainerWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width > 0) {
          setContainerWidth(width);
        }
      }
    };

    // Initial measurement
    updateContainerWidth();

    // Setup observer
    resizeObserverRef.current = new ResizeObserver(() => {
      updateContainerWidth();
    });

    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Render diagram when container width and mermaid are available
  useEffect(() => {
    if (!containerWidth || !mermaidReady || !mermaidInstance) return;

    const renderDiagram = async () => {
      try {
        setIsLoading(true);
        
        // Generate unique ID for this render
        const uniqueId = `mermaid-${id}-${Date.now()}`;
        
        // Render the diagram
        const { svg } = await mermaidInstance.render(uniqueId, chart);
        
        // Parse SVG to get dimensions
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');
        
        if (svgElement) {
          // Try to get dimensions from viewBox first
          const viewBox = svgElement.getAttribute('viewBox');
          let svgWidth = 800;
          let svgHeight = 600;
          
          if (viewBox) {
            const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
            if (vbWidth && vbHeight) {
              svgWidth = vbWidth;
              svgHeight = vbHeight;
            }
          } else {
            // Fallback to width/height attributes
            const widthAttr = svgElement.getAttribute('width');
            const heightAttr = svgElement.getAttribute('height');
            if (widthAttr && heightAttr) {
              svgWidth = parseFloat(widthAttr);
              svgHeight = parseFloat(heightAttr);
            }
          }
          
          // Calculate aspect ratio and height with max height constraint
          const svgAspectRatio = svgHeight / svgWidth;
          setAspectRatio(svgAspectRatio);
          const naturalHeight = containerWidth * svgAspectRatio;
          const calculatedHeight = Math.min(naturalHeight, maxHeight);
          
          // Set viewBox if not present
          if (!viewBox) {
            svgElement.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
          }
          
          // Update SVG for responsive sizing
          svgElement.removeAttribute('width');
          svgElement.removeAttribute('height');
          svgElement.style.width = '100%';
          svgElement.style.height = '100%';
          
          // Get the modified SVG string
          const serializer = new XMLSerializer();
          const modifiedSvg = serializer.serializeToString(svgElement);
          
          setRenderedSvg(modifiedSvg);
          setDimensions({
            width: containerWidth,
            height: Math.max(calculatedHeight, 200)
          });
        }

        // Delay revealing to next frame so height settles while still invisible
        requestAnimationFrame(() => {
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        setIsLoading(false);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      renderDiagram();
    });
  }, [id, chart, containerWidth, mermaidReady]);

  // Insert SVG into containers
  useLayoutEffect(() => {
    if (!renderedSvg || isLoading) return;

    // Normal view
    const diagramContainer = containerRef.current?.querySelector('.mermaid-svg-container');
    if (diagramContainer && renderedSvg) {
      diagramContainer.innerHTML = renderedSvg;
      const svg = diagramContainer.querySelector('svg');
      if (svg) {
        svgRef.current = svg;
      }
    }
  }, [renderedSvg, isLoading]);

  // Insert SVG into fullscreen container when opened
  useLayoutEffect(() => {
    if (!isFullscreen || !renderedSvg) return;

    const fullscreenDiagramContainer = fullscreenContainerRef.current?.querySelector('.mermaid-svg-container');
    if (fullscreenDiagramContainer) {
      fullscreenDiagramContainer.innerHTML = renderedSvg;
      const svg = fullscreenDiagramContainer.querySelector('svg');
      if (svg) {
        fullscreenSvgRef.current = svg;
      }
    }
  }, [isFullscreen, renderedSvg]);

  // Handle ESC key for fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    if (isFullscreen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Normal view handlers
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.3));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.min(Math.max(prev + delta, 0.3), 3));
  };

  // Fullscreen handlers
  const handleFullscreenZoomIn = () => setFullscreenScale(prev => Math.min(prev + 0.2, 5));
  const handleFullscreenZoomOut = () => setFullscreenScale(prev => Math.max(prev - 0.2, 0.2));
  const handleFullscreenReset = () => {
    setFullscreenScale(1);
    setFullscreenPosition({ x: 0, y: 0 });
  };

  const handleFullscreenMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFullscreenDragging(true);
    setFullscreenDragStart({ x: e.clientX - fullscreenPosition.x, y: e.clientY - fullscreenPosition.y });
  };

  const handleFullscreenMouseMove = (e: React.MouseEvent) => {
    if (isFullscreenDragging) {
      setFullscreenPosition({
        x: e.clientX - fullscreenDragStart.x,
        y: e.clientY - fullscreenDragStart.y,
      });
    }
  };

  const handleFullscreenMouseUp = () => setIsFullscreenDragging(false);

  const handleFullscreenWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setFullscreenScale(prev => Math.min(Math.max(prev + delta, 0.2), 5));
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    setFullscreenScale(1);
    setFullscreenPosition({ x: 0, y: 0 });
  };

  if (error) {
    return (
      <div className="my-6 p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20">
        <div className="text-sm text-red-600 dark:text-red-400">Error rendering diagram: {error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Normal View */}
      <div className="not-content my-6 relative" style={{ contain: 'content' }}>
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
          style={{
            width: '100%',
            minHeight: '200px',
            maxHeight: `${maxHeight}px`,
            ...(aspectRatio
              ? { aspectRatio: `1 / ${aspectRatio}` }
              : { height: '400px' }),
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading diagram...</div>
            </div>
          )}
          
          <div
            className="mermaid-svg-container absolute inset-0 flex items-center justify-center transition-transform duration-100"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: isDragging ? 'grabbing' : 'grab',
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />

          {/* Control Panel */}
          {!isLoading && (
            <div className="not-content absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1">
              <button
                onClick={handleZoomOut}
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              <div className="flex items-center justify-center px-2 text-xs text-gray-600 dark:text-gray-400 min-w-[3rem] h-8">
                {Math.round(scale * 100)}%
              </div>

              <button
                onClick={handleZoomIn}
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              <div className="w-px self-center h-4 bg-gray-300 dark:bg-gray-600 mx-0.5" />

              <button
                onClick={openFullscreen}
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal - portaled to document.body to escape sidebar stacking context */}
      {isFullscreen && createPortal(
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-[90vw] h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Close Fullscreen"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Fullscreen Diagram Container */}
            <div
              ref={fullscreenContainerRef}
              className="w-full h-full overflow-hidden"
              onMouseDown={handleFullscreenMouseDown}
              onMouseMove={handleFullscreenMouseMove}
              onMouseUp={handleFullscreenMouseUp}
              onMouseLeave={handleFullscreenMouseUp}
              onWheel={handleFullscreenWheel}
            >
              <div
                className="mermaid-svg-container w-full h-full flex items-center justify-center transition-transform duration-100"
                style={{
                  transform: `translate(${fullscreenPosition.x}px, ${fullscreenPosition.y}px) scale(${fullscreenScale})`,
                  cursor: isFullscreenDragging ? 'grabbing' : 'grab',
                }}
              />
            </div>

            {/* Fullscreen Control Panel */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
              <button
                onClick={handleFullscreenZoomOut}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="px-3 text-sm text-gray-600 dark:text-gray-400 min-w-[4rem] text-center">
                {Math.round(fullscreenScale * 100)}%
              </div>
              
              <button
                onClick={handleFullscreenZoomIn}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
              
              <button
                onClick={handleFullscreenReset}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}