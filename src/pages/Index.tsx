import React, { useState, useRef, useCallback } from 'react';
import { Download, Upload, Palette, Type, Image, RotateCcw, Save, Eye, EyeOff, Sparkles, Info, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
  name: string;
  description: string;
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
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    backgroundImage: null as string | null,
    logoImage: null as string | null,
    template: 'modern'
  });

  const [activeField, setActiveField] = useState<string | null>(null);
  const [showIndicators, setShowIndicators] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const templates: Templates = {
    modern: {
      name: 'Modern Professional',
      description: 'Clean left-aligned layout with bold typography',
      name: { x: 40, y: 60, size: 24, weight: 'bold', width: 200, height: 30 },
      title: { x: 40, y: 90, size: 16, weight: 'normal', width: 180, height: 20 },
      company: { x: 40, y: 115, size: 14, weight: 'normal', width: 160, height: 18 },
      phone: { x: 40, y: 155, size: 12, weight: 'normal', width: 140, height: 16 },
      email: { x: 40, y: 175, size: 12, weight: 'normal', width: 180, height: 16 },
      website: { x: 40, y: 195, size: 12, weight: 'normal', width: 160, height: 16 }
    },
    classic: {
      name: 'Classic Centered',
      description: 'Traditional centered design with elegant spacing',
      name: { x: 200, y: 60, size: 22, weight: 'bold', width: 160, height: 28, align: 'center' },
      title: { x: 200, y: 85, size: 14, weight: 'normal', width: 140, height: 18, align: 'center' },
      company: { x: 200, y: 105, size: 14, weight: 'bold', width: 140, height: 18, align: 'center' },
      phone: { x: 60, y: 155, size: 11, weight: 'normal', width: 120, height: 15 },
      email: { x: 60, y: 175, size: 11, weight: 'normal', width: 140, height: 15 },
      website: { x: 60, y: 195, size: 11, weight: 'normal', width: 120, height: 15 }
    },
    minimal: {
      name: 'Minimal Elegant',
      description: 'Spacious layout with right-aligned contact info',
      name: { x: 200, y: 80, size: 26, weight: 'light', width: 180, height: 32, align: 'center' },
      title: { x: 200, y: 105, size: 14, weight: 'normal', width: 120, height: 18, align: 'center' },
      company: { x: 200, y: 125, size: 12, weight: 'normal', width: 100, height: 16, align: 'center' },
      phone: { x: 360, y: 165, size: 10, weight: 'normal', width: 100, height: 14, align: 'right' },
      email: { x: 360, y: 180, size: 10, weight: 'normal', width: 120, height: 14, align: 'right' },
      website: { x: 360, y: 195, size: 10, weight: 'normal', width: 100, height: 14, align: 'right' }
    },
    executive: {
      name: 'Executive Bold',
      description: 'Corporate style with strong hierarchy',
      name: { x: 60, y: 50, size: 20, weight: 'bold', width: 160, height: 26 },
      title: { x: 60, y: 75, size: 13, weight: 'normal', width: 140, height: 17 },
      company: { x: 60, y: 95, size: 15, weight: 'bold', width: 150, height: 19 },
      phone: { x: 340, y: 155, size: 11, weight: 'normal', width: 120, height: 15, align: 'right' },
      email: { x: 340, y: 175, size: 11, weight: 'normal', width: 140, height: 15, align: 'right' },
      website: { x: 340, y: 195, size: 11, weight: 'normal', width: 120, height: 15, align: 'right' }
    },
    creative: {
      name: 'Creative Asymmetric',
      description: 'Dynamic layout with creative positioning',
      name: { x: 50, y: 70, size: 28, weight: 'bold', width: 220, height: 34 },
      title: { x: 50, y: 100, size: 16, weight: 'normal', width: 180, height: 20 },
      company: { x: 280, y: 50, size: 14, weight: 'bold', width: 100, height: 18, align: 'right' },
      phone: { x: 50, y: 160, size: 12, weight: 'normal', width: 140, height: 16 },
      email: { x: 50, y: 180, size: 12, weight: 'normal', width: 180, height: 16 },
      website: { x: 280, y: 200, size: 12, weight: 'normal', width: 100, height: 16, align: 'right' }
    },
    corporate: {
      name: 'Corporate Standard',
      description: 'Professional business layout with clear hierarchy',
      name: { x: 40, y: 55, size: 22, weight: 'bold', width: 180, height: 28 },
      title: { x: 40, y: 80, size: 14, weight: 'normal', width: 160, height: 18 },
      company: { x: 40, y: 100, size: 16, weight: 'bold', width: 170, height: 20 },
      phone: { x: 40, y: 140, size: 11, weight: 'normal', width: 130, height: 15 },
      email: { x: 40, y: 160, size: 11, weight: 'normal', width: 170, height: 15 },
      website: { x: 40, y: 180, size: 11, weight: 'normal', width: 150, height: 15 }
    },
    boutique: {
      name: 'Boutique Luxury',
      description: 'Elegant centered layout for premium brands',
      name: { x: 200, y: 90, size: 24, weight: 'light', width: 200, height: 30, align: 'center' },
      title: { x: 200, y: 115, size: 13, weight: 'normal', width: 150, height: 17, align: 'center' },
      company: { x: 200, y: 135, size: 11, weight: 'normal', width: 120, height: 15, align: 'center' },
      phone: { x: 200, y: 170, size: 10, weight: 'normal', width: 110, height: 14, align: 'center' },
      email: { x: 200, y: 185, size: 10, weight: 'normal', width: 140, height: 14, align: 'center' },
      website: { x: 200, y: 200, size: 10, weight: 'normal', width: 120, height: 14, align: 'center' }
    },
    startup: {
      name: 'Startup Dynamic',
      description: 'Modern tech-focused layout with energy',
      name: { x: 45, y: 65, size: 26, weight: 'bold', width: 210, height: 32 },
      title: { x: 45, y: 95, size: 15, weight: 'normal', width: 170, height: 19 },
      company: { x: 45, y: 120, size: 13, weight: 'bold', width: 150, height: 17 },
      phone: { x: 320, y: 150, size: 11, weight: 'normal', width: 120, height: 15, align: 'right' },
      email: { x: 320, y: 170, size: 11, weight: 'normal', width: 150, height: 15, align: 'right' },
      website: { x: 320, y: 190, size: 11, weight: 'normal', width: 130, height: 15, align: 'right' }
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

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDesign(prev => ({
          ...prev,
          logoImage: e.target?.result as string
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

    const drawTemplate = () => {
      const template = templates[design.template];
      
      // Draw field rectangles only (no text, no labels)
      Object.entries(template).forEach(([field, pos]) => {
        if (field === 'name' || field === 'description') return;
        
        const width = pos.width || 150;
        const height = pos.height || pos.size + 8;
        
        let rectX = pos.x - 4;
        if (pos.align === 'center') {
          rectX = pos.x - (width / 2) - 4;
        } else if (pos.align === 'right') {
          rectX = pos.x - width - 4;
        }
        
        const rectY = pos.y - pos.size - 3;
        
        // Draw subtle rectangle outline
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(rectX, rectY, width + 8, height + 6);
        
        // Fill with very light blue
        ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
        ctx.fillRect(rectX, rectY, width + 8, height + 6);
      });
    };

    // Draw background
    if (design.backgroundImage) {
      const img = document.createElement('img');
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 400, 240);
        drawTemplate();
        const link = document.createElement('a');
        link.download = `ai-template-${design.template}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      };
      img.src = design.backgroundImage;
    } else {
      ctx.fillStyle = design.backgroundColor;
      ctx.fillRect(0, 0, 400, 240);
      drawTemplate();
      const link = document.createElement('a');
      link.download = `ai-template-${design.template}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  }, [design, templates]);

  const downloadFinalCard = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 400;
    canvas.height = 240;

    const drawFinalCard = () => {
      const template = templates[design.template];
      
      // Draw logo if exists
      if (design.logoImage) {
        const logoImg = document.createElement('img');
        logoImg.onload = () => {
          // Position logo in top-right corner
          const logoSize = 40;
          ctx.drawImage(logoImg, 340, 20, logoSize, logoSize);
          drawText();
        };
        logoImg.src = design.logoImage;
      } else {
        drawText();
      }
      
      function drawText() {
        Object.entries(cardData).forEach(([field, text]) => {
          if (template[field] && text && field !== 'name' && field !== 'description') {
            const pos = template[field];
            ctx.font = `${pos.weight} ${pos.size}px Arial, sans-serif`;
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
      }
    };

    // Draw background
    if (design.backgroundImage) {
      const img = document.createElement('img');
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 400, 240);
        drawFinalCard();
        const link = document.createElement('a');
        link.download = `business-card-${cardData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      };
      img.src = design.backgroundImage;
    } else {
      ctx.fillStyle = design.backgroundColor;
      ctx.fillRect(0, 0, 400, 240);
      drawFinalCard();
      const link = document.createElement('a');
      link.download = `business-card-${cardData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
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
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      backgroundImage: null,
      logoImage: null,
      template: 'modern'
    });
  };

  const currentTemplate = templates[design.template];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                AI Business Card Studio
              </h1>
              <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
                Design professional business cards with AI-powered styling. Create clean templates, enhance with AI generators, and export perfect cards.
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              <Sparkles size={16} className="mr-1" />
              AI Ready
            </Badge>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowIndicators(!showIndicators)}
              variant={showIndicators ? "default" : "outline"}
              className="gap-2"
            >
              {showIndicators ? <EyeOff size={18} /> : <Eye size={18} />}
              {showIndicators ? 'Hide' : 'Show'} Guides
            </Button>
            
            <Button
              onClick={downloadTemplate}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download size={18} />
              Download AI Template
            </Button>
            
            <Button
              onClick={() => backgroundInputRef.current?.click()}
              variant="outline"
              className="gap-2"
            >
              <Upload size={18} />
              Upload Background
            </Button>
            
            <Button
              onClick={downloadFinalCard}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save size={18} />
              Export Final Card
            </Button>
            
            <Button
              onClick={resetToDefault}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw size={18} />
              Reset
            </Button>
          </div>

          <input
            ref={backgroundInputRef}
            type="file"
            accept="image/*"
            onChange={handleBackgroundUpload}
            className="hidden"
          />
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Business Card Preview */}
          <div className="xl:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Palette size={20} className="text-blue-600" />
                  Card Preview
                  <Badge variant="outline" className="text-xs">
                    {templates[design.template].name}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div
                    ref={cardRef}
                    className="relative rounded-xl overflow-hidden shadow-lg border-2 border-slate-200"
                    style={{
                      width: '400px',
                      height: '240px',
                      backgroundColor: design.backgroundColor,
                      backgroundImage: design.backgroundImage ? `url(${design.backgroundImage})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Logo */}
                    {design.logoImage && (
                      <img
                        src={design.logoImage}
                        alt="Logo"
                        className="absolute top-5 right-5 w-10 h-10 object-contain rounded"
                      />
                    )}

                    {/* Template Indicators */}
                    {showIndicators && (
                      <div className="absolute inset-0 pointer-events-none">
                        {Object.entries(currentTemplate).map(([field, pos]) => {
                          if (field === 'name' || field === 'description' || !pos) return null;
                          
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
                              {/* Clean field outline */}
                              <div
                                className="absolute border-2 border-blue-400/40 rounded bg-blue-50/20"
                                style={{
                                  left: `${rectX}px`,
                                  top: `${rectY}px`,
                                  width: `${width + 8}px`,
                                  height: `${height + 6}px`
                                }}
                              />
                              {/* Corner indicators */}
                              <div
                                className="absolute w-2 h-2 bg-blue-500 rounded-full"
                                style={{
                                  left: `${rectX - 2}px`,
                                  top: `${rectY - 2}px`
                                }}
                              />
                              <div
                                className="absolute w-2 h-2 bg-blue-500 rounded-full"
                                style={{
                                  left: `${rectX + width + 6}px`,
                                  top: `${rectY + height + 4}px`
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
                      if (!pos || field === 'name' || field === 'description') return null;
                      
                      const textAlign = pos.align === 'center' ? 'center' : pos.align === 'right' ? 'right' : 'left';
                      const transform = pos.align === 'center' ? 'translateX(-50%)' : pos.align === 'right' ? 'translateX(-100%)' : '';
                      
                      return (
                        <div
                          key={field}
                          className={`absolute cursor-pointer hover:bg-blue-100/30 transition-all duration-200 rounded px-1 ${
                            activeField === field ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''
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
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <Tabs defaultValue="template" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>

              {/* Template Selection */}
              <TabsContent value="template" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Type size={18} className="text-blue-600" />
                      Choose Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(templates).map(([templateKey, template]) => (
                      <button
                        key={templateKey}
                        onClick={() => setDesign(prev => ({ ...prev, template: templateKey }))}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                          design.template === templateKey
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{template.name}</div>
                        <div className="text-sm text-slate-600 mt-1">
                          {template.description}
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Type size={18} className="text-blue-600" />
                      Card Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(cardData).map(([field, value]) => (
                      <div key={field}>
                        <Label className="text-sm font-medium text-slate-700 capitalize">
                          {field}
                        </Label>
                        <Input
                          type="text"
                          value={value}
                          onChange={(e) => handleTextChange(field, e.target.value)}
                          className={`mt-1 ${
                            activeField === field ? 'ring-2 ring-blue-500 border-blue-500' : ''
                          }`}
                          placeholder={`Enter ${field}`}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Design Tab */}
              <TabsContent value="design" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Palette size={18} className="text-blue-600" />
                      Colors & Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium text-slate-700">
                        Background Color
                      </Label>
                      <input
                        type="color"
                        value={design.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="w-full h-12 border-2 border-slate-200 rounded-lg cursor-pointer mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-700">
                        Text Color
                      </Label>
                      <input
                        type="color"
                        value={design.textColor}
                        onChange={(e) => handleColorChange('textColor', e.target.value)}
                        className="w-full h-12 border-2 border-slate-200 rounded-lg cursor-pointer mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-700">
                        Logo/Photo
                      </Label>
                      <div className="mt-1">
                        {design.logoImage ? (
                          <div className="relative">
                            <img
                              src={design.logoImage}
                              alt="Logo"
                              className="w-full h-20 object-cover rounded-lg border-2 border-slate-200"
                            />
                            <Button
                              onClick={() => setDesign(prev => ({ ...prev, logoImage: null }))}
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => logoInputRef.current?.click()}
                            variant="outline"
                            className="w-full h-20 border-dashed border-2 gap-2"
                          >
                            <Plus size={18} />
                            Add Logo/Photo
                          </Button>
                        )}
                      </div>
                    </div>

                    {design.backgroundImage && (
                      <div>
                        <Label className="text-sm font-medium text-slate-700">
                          Background Image
                        </Label>
                        <div className="mt-1 relative">
                          <img
                            src={design.backgroundImage}
                            alt="Background"
                            className="w-full h-20 object-cover rounded-lg border-2 border-slate-200"
                          />
                          <Button
                            onClick={() => setDesign(prev => ({ ...prev, backgroundImage: null }))}
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* AI Workflow Instructions */}
        <Card className="mt-8 border-blue-200 bg-blue-50/30">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Info size={24} className="text-blue-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">AI-Enhanced Design Workflow</h3>
                <div className="grid md:grid-cols-2 gap-6 text-slate-600">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Step 1: Create Template</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Choose your preferred layout template</li>
                      <li>• Add your business information</li>
                      <li>• Download the clean AI template with field guides</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Step 2: AI Enhancement</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Upload template to AI tools (Midjourney, DALL-E)</li>
                      <li>• Use prompts like "elegant marble texture" or "modern gradient"</li>
                      <li>• AI will preserve the field guide rectangles</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Step 3: Import & Finalize</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Upload your AI-enhanced background</li>
                      <li>• Text automatically positions perfectly</li>
                      <li>• Export your professional business card</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Pro Tips</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Field guides ensure perfect text alignment</li>
                      <li>• Add logos for brand consistency</li>
                      <li>• Maintain high contrast for readability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessCardMaker;