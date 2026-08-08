import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import { File, Paths } from 'expo-file-system';

interface QRCodeRendererProps {
  svgContent: string;
  onPNGGenerated: (uri: string) => void;
  onError?: (error: Error) => void;
}

export function QRCodeRenderer({ svgContent, onPNGGenerated, onError }: QRCodeRendererProps) {
  const viewRef = useRef<View>(null);
  const hasGenerated = useRef(false);

  useEffect(() => {
    console.log("🎨 QRCodeRenderer mounted with SVG content length:", svgContent.length);
    
    if (hasGenerated.current) {
      console.log("⏭️ Already generated, skipping");
      return;
    }
    
    const generatePNG = async () => {
      console.log("🔄 Starting PNG generation...");
      try {
        if (!viewRef.current) {
          console.log("❌ View ref not ready");
          return;
        }

        console.log("⏳ Waiting for view to render...");
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log("✅ View ready, capturing...");
        
        const uri = await captureRef(viewRef.current, {
          format: 'png',
          quality: 0.9,
          result: 'tmpfile',
        });
        console.log("📸 PNG captured at:", uri);
        
        const fileName = `qr-${Date.now()}.png`;
        console.log("📁 Target file name:", fileName);
        const targetFile = new File(Paths.cache, fileName);
        
        if (targetFile.exists) {
          console.log("🗑️ Deleting existing file:", targetFile.uri);
          targetFile.delete();
        }
        
        console.log("📝 Creating new file...");
        targetFile.create({ overwrite: true });
        
        console.log("📄 Copying source to target...");
        const sourceFile = new File(uri);
        sourceFile.copy(targetFile);
        console.log("✅ File copied successfully");
        
        hasGenerated.current = true;
        console.log("📤 Calling onPNGGenerated with:", targetFile.uri);
        onPNGGenerated(targetFile.uri);
      } catch (error) {
        console.error("❌ PNG generation error:", error);
        if (onError) onError(error as Error);
      }
    };

    generatePNG();
  }, [svgContent]);

  return (
    <View 
      ref={viewRef} 
      style={{ 
        position: 'absolute', 
        opacity: 0, 
        width: 300, 
        height: 300,
        zIndex: -1,
        backgroundColor: 'white',
      }}
      collapsable={false}
    >
      <SvgXml xml={svgContent} width={300} height={300} />
    </View>
  );
}