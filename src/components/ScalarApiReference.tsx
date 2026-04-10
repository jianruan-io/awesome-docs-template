import { useEffect, useRef } from 'react';

interface ScalarApiReferenceProps {
  specUrl?: string;
  configuration?: any;
  fullPage?: boolean;
}

export default function ScalarApiReference({
  specUrl,
  configuration = {},
  fullPage = false
}: ScalarApiReferenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const loadScalar = async () => {
      // Check if Scalar is already loaded
      if ((window as any).Scalar) {
        initializeScalar();
        return;
      }

      // Load Scalar from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference';
      script.async = true;
      
      script.onload = () => {
        // Small delay to ensure Scalar is fully loaded
        timeoutId = setTimeout(initializeScalar, 100);
      };

      script.onerror = () => {
        console.error('Failed to load Scalar API Reference from CDN');
      };

      document.body.appendChild(script);
    };

    const initializeScalar = () => {
      if ((window as any).Scalar && containerRef.current && !instanceRef.current) {
        // Clear container
        containerRef.current.innerHTML = '';
        
        // Default configuration
        const defaultConfig = {
          spec: {
            url: specUrl || '/openapi.json'
          },
          theme: 'default',
          layout: 'modern',
          hideModels: false,
          hideDownloadButton: false,
          searchHotKey: 'k',
          showSidebar: true,
        };

        // Merge configurations, but handle spec object specially
        const finalConfig = {
          ...defaultConfig,
          ...configuration,
          spec: {
            ...defaultConfig.spec,
            ...(configuration.spec || {})
          }
        };
        
        try {
          // Create API reference instance
          instanceRef.current = (window as any).Scalar.createApiReference(
            containerRef.current, 
            finalConfig
          );
        } catch (error) {
          console.error('Error initializing Scalar:', error);
        }
      }
    };

    loadScalar();

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Don't remove the script as it might be used by other instances
    };
  }, [specUrl, configuration]);

  const containerStyles = fullPage 
    ? { 
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed' as const,
        top: 0,
        left: 0,
        zIndex: 50,
        backgroundColor: 'white'
      }
    : { 
        minHeight: 'calc(100vh - 64px)',
        width: '100%'
      };

  return (
    <div 
      ref={containerRef}
      style={containerStyles}
    >
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#666'
      }}>
        Loading API Reference...
      </div>
    </div>
  );
}