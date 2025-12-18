import React, { useState, useRef, useCallback } from 'react';
import { Download, Upload, Palette, Type, Image, RotateCcw, Save, Eye, EyeOff, Sparkles, Info } from 'lucide-react';

interface FieldPosition {
  x: number;
  y: number;
  size: number;
  weight: string;
  width: number;
  height: number;
  align?: 'left' | 'center' | 'right';
}

interface Template {
  [key: string]: FieldPosition;
}

interface Templates {
  [key: string]: Template;
}

const BusinessCardMaker = () => {
  const [cardData, setCardData] = useState({
    name: 'John Doe',
    title: 'Creative Director',
    company: 'Design Studio',
    phone: '+1 (555) 123-4567',
    email: 'john@designstudio.com',
    website: 'www.designstudio.com'
  });

  const [design, setDesign] = useState({
    backgroundColor: '#1a2744',
    textColor: '#f8fafc',
    backgroundImage: null as string | null,
    template: 'modern'
  });

  const [activeField, setActiveField] = useState<string | null>(null);
  const [showIndicators, setShowIndicators] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates: Templates = {
    modern: {
      name: { x: 40, y: 60, size: 24, weight: 'bold', width: 200, height: 30 },
      title: { x: 40, y: 90, size: 16, weight: 'normal', width: 180, height: 20 },
      company: { x: 40, y: 115, size: 14, weight: 'normal', width: 160, height: 18 },
      phone: { x: 40, y: 155, size: 12, weight: 'normal', width: 140, height: 16 },
      email: { x: 40, y: 175, size: 12, weight: 'normal', width: 180, height: 16 },
      website: { x: 40, y: 195, size: 12, weight: 'normal', width: 160, height: 16 }
    },
    classic: {
      name: { x: 200, y: 60, size: 22, weight: 'bold', width: 160, height: 28, align: 'center' },
      title: { x: 200, y: 85, size: 14, weight: 'normal', width: 140, height: 18, align: 'center' },
      company: { x: 200, y: 105, size: 14, weight: 'bold', width: 140, height: 18, align: 'center' },
      phone: { x: 60, y: 155, size: 11, weight: 'normal', width: 120, height: 15 },
      email: { x: 60, y: 175, size: 11, weight: 'normal', width: 140, height: 15 },
      website: { x: 60, y: 195, size: 11, weight: 'normal', width: 120, height: 15 }
    },
    minimal: {
      name: { x: 200, y: 80, size: 26, weight: 'light', width: 180, height: 32, align: 'center' },
      title: { x: 200, y: 105, size: 14, weight: 'normal', width: 120, height: 18, align: 'center' },
      company: { x: 200, y: 125, size: 12, weight: 'normal', width: 100, height: 16, align: 'center' },
      phone: { x: 280, y: 165, size: 10, weight: 'normal', width: 100, height: 14, align: 'right' },
      email: { x: 280, y: 180, size: 10, weight: 'normal', width: 120, height: 14, align: 'right' },
      website: { x: 280, y: 195, size: 10, weight: 'normal', width: 100, height: 14, align: 'right' }
    },
    executive: {
      name: { x: 60, y: 50, size: 20, weight: 'bold', width: 160, height: 26 },
      title: { x: 60, y: 75, size: 13, weight: 'normal', width: 140, height: 17 },
      company: { x: 60, y: 95, size: 15, weight: 'bold', width: 150, height: 19 },
      phone: { x: 240, y: 155, size: 11, weight: 'normal', width: 120, height: 15, align: 'right' },
      email: { x: 240, y: 175, size: 11, weight: 'normal', width: 140, height: 15, align: 'right' },
      website: { x: 240, y: 195, size: 11, weight: 'normal', width: 120, height: 15, align: 'right' }
    }
  };

  const handleTextChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorChange = (type: string, color: string) => {
    setDesign(prev => ({
      ...prev,
      [type]: color
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDesign(prev => ({
          ...prev,
          backgroundImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadTemplate = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 400;
    canvas.height = 240;

    const drawTemplateIndicators = () => {
      // NO INDICATORS AT ALL for clean AI templates
    };

    if (design.backgroundImage) {
      const img = document.createElement('img');
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 400, 240);
        drawTemplateIndicators();
        const link = document.createElement('a');
        link.download = `business-card-template-${design.template}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      };
      img.src = design.backgroundImage;
    } else {
      ctx.fillStyle = design.backgroundColor;
      ctx.fillRect(0, 0, 400, 240);
      drawTemplateIndicators();
      const link = document.createElement('a');
      link.download = `business-card-template-${design.template}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  }, [design.backgroundColor, design.backgroundImage, design.template]);

  const downloadFinalCard = useCallback(() => {
    if (cardRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = 400;
      canvas.height = 240;

      const drawTextOnCanvas = (ctx: CanvasRenderingContext2D) => {
        const template = templates[design.template];
        
        Object.entries(cardData).forEach(([field, text]) => {
          if (template[field] && text) {
            const pos = template[field];
            ctx.font = `${pos.weight} ${pos.size}px Inter, Arial`;
            ctx.fillStyle = design.textColor;
            
            if (pos.align === 'center') {
              ctx.textAlign = 'center';
              ctx.fillText(text, pos.x, pos.y);
            } else if (pos.align === 'right') {
              ctx.textAlign = 'right';
              ctx.fillText(text, pos.x, pos.y);
            } else {
              ctx.textAlign = 'left';
              ctx.fillText(text, pos.x, pos.y);
            }
          }
        });
      };

      if (design.backgroundImage) {
        const img = document.createElement('img');
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 400, 240);
          drawTextOnCanvas(ctx);
          const link = document.createElement('a');
          link.download = `business-card-final-${cardData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
          link.href = canvas.toDataURL('image/png', 1.0);
          link.click();
        };
        img.src = design.backgroundImage;
      } else {
        ctx.fillStyle = design.backgroundColor;
        ctx.fillRect(0, 0, 400, 240);
        drawTextOnCanvas(ctx);
        const link = document.createElement('a');
        link.download = `business-card-final-${cardData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }
    }
  }, [cardData, design, templates]);

  const resetToDefault = () => {
    setCardData({
      name: 'John Doe',
      title: 'Creative Director',
      company: 'Design Studio',
      phone: '+1 (555) 123-4567',
      email: 'john@designstudio.com',
      website: 'www.designstudio.com'
    });
    setDesign({
      backgroundColor: '#1a2744',
      textColor: '#f8fafc',
      backgroundImage: null,
      template: 'modern'
    });
  };

  const currentTemplate = templates[design.template];

  return (
    <div className="min-h-screen relative overflow-hidden noise-overlay">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
                AI Business Card Studio
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Design professional business cards with AI-powered styling. Create templates, enhance with AI, and export perfect cards.
              </p>
            </div>
            <div className="flex items-center gap-2 glass-button px-4 py-2.5 rounded-xl">
              <Sparkles size={20} className="text-primary" />
              <span className="font-medium text-foreground">AI Ready</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                showIndicators 
                  ? 'bg-primary text-primary-foreground glow-primary' 
                  : 'glass-button text-foreground'
              }`}
            >
              {showIndicators ? <EyeOff size={18} /> : <Eye size={18} />}
              {showIndicators ? 'Hide' : 'Show'} Field Guides
            </button>
            
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 bg-info/90 hover:bg-info text-info-foreground px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:shadow-glow"
            >
              <Download size={18} />
              Download AI Template
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-success/90 hover:bg-success text-success-foreground px-5 py-2.5 rounded-xl font-medium transition-all duration-300"
            >
              <Upload size={18} />
              Upload AI-Styled Card
            </button>
            
            <button
              onClick={downloadFinalCard}
              className="flex items-center gap-2 bg-accent/90 hover:bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:shadow-glow-accent"
            >
              <Save size={18} />
              Export Final Card
            </button>
            
            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 glass-button text-muted-foreground hover:text-foreground px-5 py-2.5 rounded-xl font-medium"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Business Card Preview */}
          <div className="xl:col-span-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-foreground">
                <Palette size={20} className="text-primary" />
                Card Preview
                <span className="text-sm text-muted-foreground font-normal glass-button px-3 py-1 rounded-lg">
                  {design.template}
                </span>
              </h2>
              
              <div className="flex justify-center">
                <div
                  ref={cardRef}
                  className="relative rounded-2xl overflow-hidden shadow-elevated transition-all duration-300 hover:shadow-glow"
                  style={{
                    width: '400px',
                    height: '240px',
                    backgroundColor: design.backgroundColor,
                    backgroundImage: design.backgroundImage ? `url(${design.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid hsl(210 40% 98% / 0.1)'
                  }}
                >
                  {/* Template Indicators */}
                  {showIndicators && (
                    <div className="absolute inset-0 pointer-events-none">
                      {Object.entries(currentTemplate).map(([field, pos]) => {
                        if (!pos) return null;
                        
                        const width = pos.width || 150;
                        const height = pos.height || pos.size + 8;
                        
                        let rectX = pos.x - 4;
                        if (pos.align === 'center') {
                          rectX = pos.x - (width / 2) - 4;
                        } else if (pos.align === 'right') {
                          rectX = pos.x - width - 4;
                        }
                        
                        const rectY = pos.y - pos.size - 3;
                        
                        return (
                          <div key={`indicator-${field}`}>
                            {/* Subtle field outline */}
                            <div
                              className="absolute rounded"
                              style={{
                                left: `${rectX}px`,
                                top: `${rectY}px`,
                                width: `${width + 8}px`,
                                height: `${height + 6}px`,
                                border: '1px solid hsl(191 91% 61% / 0.3)',
                                background: 'hsl(191 91% 61% / 0.05)'
                              }}
                            />
                            {/* Corner dots */}
                            <div
                              className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
                              style={{
                                left: `${rectX - 1}px`,
                                top: `${rectY - 1}px`
                              }}
                            />
                            <div
                              className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
                              style={{
                                left: `${rectX + width + 7}px`,
                                top: `${rectY - 1}px`
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Text Fields */}
                  {Object.entries(cardData).map(([field, text]) => {
                    const pos = currentTemplate[field];
                    if (!pos) return null;
                    
                    const textAlign = pos.align === 'center' ? 'center' : pos.align === 'right' ? 'right' : 'left';
                    const transform = pos.align === 'center' ? 'translateX(-50%)' : pos.align === 'right' ? 'translateX(-100%)' : '';
                    
                    return (
                      <div
                        key={field}
                        className={`absolute cursor-pointer transition-all duration-200 rounded px-1 ${
                          activeField === field 
                            ? 'ring-2 ring-primary bg-primary/10' 
                            : 'hover:bg-primary/5'
                        }`}
                        style={{
                          left: `${pos.x}px`,
                          top: `${pos.y - pos.size}px`,
                          fontSize: `${pos.size}px`,
                          fontWeight: pos.weight,
                          color: design.textColor,
                          textAlign: textAlign as 'left' | 'center' | 'right',
                          transform: transform,
                          minWidth: pos.width ? `${pos.width}px` : 'auto',
                          minHeight: `${pos.size + 4}px`,
                          lineHeight: '1.2'
                        }}
                        onClick={() => setActiveField(field)}
                      >
                        {text || `[${field}]`}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Type size={18} className="text-primary" />
                Template Style
              </h3>
              
              <div className="space-y-3">
                {Object.keys(templates).map((template) => (
                  <button
                    key={template}
                    onClick={() => setDesign(prev => ({ ...prev, template }))}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      design.template === template
                        ? 'bg-primary/20 border border-primary/50 shadow-template'
                        : 'glass-button border border-transparent hover:border-primary/30'
                    }`}
                  >
                    <div className="font-semibold capitalize text-foreground">{template}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {template === 'modern' && 'Clean, professional layout'}
                      {template === 'classic' && 'Centered, traditional design'}
                      {template === 'minimal' && 'Elegant, spacious layout'}
                      {template === 'executive' && 'Bold, corporate style'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Content */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Type size={18} className="text-primary" />
                Card Content
              </h3>
              
              <div className="space-y-4">
                {Object.entries(cardData).map(([field, value]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-foreground mb-2 capitalize">
                      {field}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleTextChange(field, e.target.value)}
                      className={`w-full p-3 rounded-xl glass-input text-foreground placeholder-muted-foreground ${
                        activeField === field ? 'ring-2 ring-primary border-primary/50' : ''
                      }`}
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Design Controls */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Image size={18} className="text-primary" />
                Design Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Background Color
                  </label>
                  <div className="relative">
                    <input
                      type="color"
                      value={design.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="w-full h-12 rounded-xl cursor-pointer glass-input"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={design.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="w-full h-12 rounded-xl cursor-pointer glass-input"
                  />
                </div>

                {design.backgroundImage && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Background Image
                    </label>
                    <div className="w-full h-20 rounded-xl overflow-hidden glass-input">
                      <img
                        src={design.backgroundImage}
                        alt="Background"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => setDesign(prev => ({ ...prev, backgroundImage: null }))}
                      className="mt-2 text-sm text-destructive hover:text-destructive/80 transition-colors"
                    >
                      Remove Background Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Workflow Instructions */}
        <div className="mt-8 glass-card rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-start gap-4">
            <div className="glass-button rounded-xl p-3">
              <Info size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-4">AI-Enhanced Design Workflow</h3>
              <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
                <div className="glass-button rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-2">Step 1: Create Template</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Design your layout and add content</li>
                    <li>• Toggle field guides on to see placement areas</li>
                    <li>• Download the AI template with visual indicators</li>
                  </ul>
                </div>
                <div className="glass-button rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-2">Step 2: AI Enhancement</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Upload template to AI (Midjourney, DALL-E, etc.)</li>
                    <li>• Use prompts like "elegant marble texture" or "modern gradient"</li>
                    <li>• Keep the field guides intact during generation</li>
                  </ul>
                </div>
                <div className="glass-button rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-2">Step 3: Import & Finalize</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Upload your AI-enhanced background</li>
                    <li>• Text automatically overlays correctly</li>
                    <li>• Export your professional business card</li>
                  </ul>
                </div>
                <div className="glass-button rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-2">Pro Tips</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Field guides ensure perfect text alignment</li>
                    <li>• Try different templates for varied layouts</li>
                    <li>• Maintain high contrast for readability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardMaker;
