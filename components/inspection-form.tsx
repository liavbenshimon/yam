"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, Loader2, LogOut } from "lucide-react";
import { validateFormData } from "@/app/actions/generate-pdf";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getManagerById } from "@/lib/managers-data";
import { useAuth } from "@/lib/auth";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "../fonts/NotoSansHebrew";
import { twMerge } from "tailwind-merge";

interface CheckItem {
  id: string;
  topic: string;
  isOk: boolean | null;
  isNotOk: boolean | null;
  comments: string;
}

interface InspectionFormProps {
  managerId: string;
  managerName: string;
}

export default function InspectionForm({
  managerId,
  managerName,
}: InspectionFormProps) {
  const { logout } = useAuth();
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [availableClients, setAvailableClients] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [managerNotes, setManagerNotes] = useState({
    general: "",
    systems: "",
  });
  const [submissionTime, setSubmissionTime] = useState<string>("");

  const formRef = useRef<HTMLDivElement | null>(null);
  const systemsRef = useRef<HTMLDivElement | null>(null);
  const generalRef = useRef<HTMLDivElement | null>(null);

  // Loading the current manager's clients
  useEffect(() => {
    const manager = getManagerById(managerId);
    if (manager) {
      setAvailableClients(manager.clients);
    }
  }, [managerId]);

  // First checklist items
  const [generalItems, setGeneralItems] = useState<CheckItem[]>([
    {
      id: "garden",
      topic: "מצב הגינה+ פרחים ודשא",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "mailboxNames",
      topic: "שמות לתיבות דואר",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "buildingFrontCleanliness",
      topic: "ניקיון כללי של חזית הבניין",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "lobbyCleanliness",
      topic:
        "ניקיון כללי של הלובי + מעליות + מסילות מעליות + תיבות דואר+ חלונות",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "garbageRoomCleanliness",
      topic: "ניקיון חדר האשפה",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "floorsCleanliness",
      topic: "ניקיון כללי בקומות מגורים",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "stairwellCleanliness",
      topic: "ניקיון חדרי המדרגות",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "stairwellDoors",
      topic: "בדיקת דלתות חדר מדרגות שנסגרות (מחזירים)",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "stairwellItems",
      topic: "פינוי חפצים בחדר מדרגות",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "parkingCleanliness",
      topic: "ניקיון החניון תחתון",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "parkingDrainage",
      topic: "בדק ניקוזים בחניון",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "parkingItems",
      topic: "פינוי חפצים בחניון",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "clubCleanliness",
      topic: "ניקיון מועדון",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "roofCleanliness",
      topic: "בדק ניקיון הגג וניקוזים",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "stairsDoors",
      topic: "בדיקת הדלתות במדרגות שנסגרות",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "lighting",
      topic: "בדק כללי של תאורה/ החלפת נורות",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "timers",
      topic: "כוון שעוני שבת לפי האור",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
  ]);

  // Systems checklist items
  const [systemItems, setSystemItems] = useState<CheckItem[]>([
    {
      id: "generator",
      topic: "גנרטור – הנעה חודשית + מצב סולר",
      isOk: null,
      isNotOk: null,
      comments: "טיפול מונע בסוף כל שנה, בדיקה אחת לשנה על ידי טכנאי מוסמך",
    },
    {
      id: "waterPumps",
      topic: "משאבות מים בבניין- בדיקה חודשית",
      isOk: null,
      isNotOk: null,
      comments: "בדיקה ויזואלית לאיתור נזילות ורעשים + הפעלה לפי צורך",
    },
    {
      id: "fireDetection",
      topic: "מערכת גילוי אש- בדק ויזואלי לתקלות",
      isOk: null,
      isNotOk: null,
      comments: "בדיקה אחת לשנה על ידי טכנאי מוסמך",
    },
    {
      id: "sprinklers",
      topic: "ספרינקלרים – בדק ויזואלי לאיתור נזילות",
      isOk: null,
      isNotOk: null,
      comments: "בדיקה אחת לשנה על ידי טכנאי מוסמך",
    },
    {
      id: "fans",
      topic: "מפוחים – הפעלה חודשית",
      isOk: null,
      isNotOk: null,
      comments: "בדיקה אחת לשנה על ידי טכנאי מוסמך",
    },
    {
      id: "submersiblePumps",
      topic: "משאבות טבולות – הפעלה חודשית",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "electricGates",
      topic: "שערים חשמליים לחניון- בדק ויזואלי",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
  ]);

  const handleGeneralItemChange = (
    index: number,
    field: "isOk" | "isNotOk" | "comments",
    value: any
  ) => {
    const newItems = [...generalItems];

    if (field === "isOk" && value === true) {
      newItems[index].isOk = true;
      newItems[index].isNotOk = false;
    } else if (field === "isNotOk" && value === true) {
      newItems[index].isOk = false;
      newItems[index].isNotOk = true;
    } else {
      (newItems[index] as any)[field] = value;
    }

    setGeneralItems(newItems);
  };

  const handleSystemItemChange = (
    index: number,
    field: "isOk" | "isNotOk" | "comments",
    value: any
  ) => {
    const newItems = [...systemItems];

    if (field === "isOk" && value === true) {
      newItems[index].isOk = true;
      newItems[index].isNotOk = false;
    } else if (field === "isNotOk" && value === true) {
      newItems[index].isOk = false;
      newItems[index].isNotOk = true;
    } else {
      (newItems[index] as any)[field] = value;
    }

    setSystemItems(newItems);
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Function to generate the PDF
  const generatePDF = async () => {
    setIsPrinting(true);
    await new Promise((res) => setTimeout(res, 300)); // המתנה קצרה לרינדור מחדש

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true,
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    // שמירת הסגנונות המקוריים של הרפרנסים
    const originalStyles = {
      form: saveOriginalStyles(formRef.current),
      systems: saveOriginalStyles(systemsRef.current),
      general: saveOriginalStyles(generalRef.current),
    };

    try {
      // טיפול בדף ראשון
      if (formRef.current) {
        applyFixedStyles(formRef.current);

        const canvas = await html2canvas(formRef.current, {
          scale: Math.min(window.devicePixelRatio, 2),
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 794,
          windowHeight: 1123,
          logging: false,
        });

        restoreOriginalStyles(formRef.current, originalStyles.form);

        const margin = 10;
        const imgWidth = 210 - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          margin,
          margin,
          imgWidth,
          imgHeight
        );
      }

      // טיפול בדף שני
      doc.addPage();
      if (systemsRef.current) {
        applyFixedStyles(systemsRef.current);

        const canvas = await html2canvas(systemsRef.current, {
          scale: Math.min(window.devicePixelRatio, 2),
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 794,
          windowHeight: 1123,
          logging: false,
        });

        restoreOriginalStyles(systemsRef.current, originalStyles.systems);

        const margin = 10;
        const imgWidth = 210 - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          margin,
          margin,
          imgWidth,
          imgHeight
        );
      }

      // טיפול בדף שלישי
      doc.addPage();
      if (generalRef.current) {
        applyFixedStyles(generalRef.current);

        const canvas = await html2canvas(generalRef.current, {
          scale: Math.min(window.devicePixelRatio, 2),
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 794,
          windowHeight: 1123,
          logging: false,
        });

        restoreOriginalStyles(generalRef.current, originalStyles.general);

        const margin = 10;
        const imgWidth = 210 - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          margin,
          margin,
          imgWidth,
          imgHeight
        );
      }

      const filename = `inspection_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setErrorMessage(
        `אירעה שגיאה ביצירת ה-PDF: ${
          error instanceof Error ? error.message : "שגיאה לא ידועה"
        }`
      );
    } finally {
      setIsPrinting(false);
    }
  };

  // פונקציית עזר לשמירת סגנונות מקוריים
  function saveOriginalStyles(element: HTMLElement | null) {
    if (!element) return {};

    return {
      width: element.style.width,
      height: element.style.height,
      maxWidth: element.style.maxWidth,
      position: element.style.position,
      transform: element.style.transform,
      overflow: element.style.overflow,
    };
  }

  // פונקציית עזר לקביעת סגנונות קבועים לפני הלכידה
  function applyFixedStyles(element: HTMLElement) {
    if (!element) return;

    element.style.width = "794px";
    element.style.maxWidth = "none";
    element.style.position = "absolute";
    element.style.transform = "scale(1)";
    element.style.overflow = "visible";
  }

  // פונקציית עזר לשחזור הסגנונות המקוריים
  function restoreOriginalStyles(
    element: HTMLElement,
    originalStyles: Partial<CSSStyleDeclaration>
  ) {
    if (!element || !originalStyles) return;

    element.style.width = originalStyles.width || "";
    element.style.height = originalStyles.height || "";
    element.style.maxWidth = originalStyles.maxWidth || "";
    element.style.position = originalStyles.position || "";
    element.style.transform = originalStyles.transform || "";
    element.style.overflow = originalStyles.overflow || "";
  }

  // פונקציית ה-submit נשארת כמעט זהה
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);

    const now = new Date();
    const timestamp = now.toLocaleString("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    setSubmissionTime(timestamp);

    const formData = {
      inspector: managerName,
      address: selectedClient,
      date,
      generalItems,
      systemItems,
      managerNotes,
    };

    try {
      const result = await validateFormData(formData);

      if (result.success) {
        await generatePDF();
      } else {
        setErrorMessage(result.error || "אירעה שגיאה באימות הנתונים");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setErrorMessage(
        `אירעה שגיאה ביצירת ה-PDF: ${
          error instanceof Error ? error.message : "שגיאה לא ידועה"
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      dir="rtl"
    >
      <form onSubmit={handleSubmit} className="p-4 md:p-6">
        <div className="rounded-lg overflow-hidden" ref={formRef}>
          {/* Header */}
          <div className="bg-[#091057] text-white p-4 md:p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-lg">
                <Image
                  src="/yamlogo.jpg"
                  alt="YAMOT Logo"
                  width={150}
                  height={100}
                  priority
                />
              </div>
            </div>
            <h1 className="text-xl md:text-3xl font-bold">
              ים ניהול ואחזקה – סיור ביקורת
            </h1>
            <p className="mt-2 text-[#EC8305]">מצוינות במבחן היומיומי</p>
            {/* Logout Button */}
            {!isPrinting && (
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white hover:text-[#EC8305] flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  התנתק
                </Button>
              </div>
            )}
          </div>
          {/* פרטי המנהל והבניין - Flexbox Layout */}
          <div className="mb-4 mt-4 flex flex-col md:flex-row gap-4">
            {/* Manager Details */}
            <div className="flex-1 border border-[#DBD3D3] rounded-md p-4">
              <div className="bg-[#024CAA] text-white p-2 rounded-t-md -m-4 mb-4">
                <h3 className="font-bold text-right">פרטי המנהל</h3>
              </div>
              <div className="mb-2">
                <Label
                  htmlFor="manager"
                  className="block mb-1 text-right [line-height:3]"
                >
                  שם המנהל:
                </Label>
                <div className="p-2 bg-gray-50 rounded border border-gray-200 text-right">
                  {managerName}
                </div>
              </div>
            </div>
            {/* Building and Date Details */}
            <div className="flex-1 border border-[#DBD3D3] rounded-md p-4">
              <div className="bg-[#024CAA] text-white p-2 rounded-t-md -m-4 mb-4">
                <h3 className="font-bold text-right">פרטי הבניין ותאריך</h3>
              </div>
              <div className="mb-2">
                <Label
                  htmlFor="client"
                  className="block mb-1 text-right [line-height:3]"
                >
                  שם הלקוח:
                </Label>
                {isPrinting ? (
                  <p className="text-right">{selectedClient}</p>
                ) : (
                  <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                    dir="rtl" // Ensure dropdown opens correctly in RTL
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue placeholder="בחר לקוח" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClients.map((client) => (
                        <SelectItem key={client} value={client}>
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <Label
                  htmlFor="date"
                  className="block mb-1 text-right [line-height:3]"
                >
                  תאריך:
                </Label>
                {isGenerating ? (
                  <p className="text-right">{formatDateForDisplay(date)}</p>
                ) : (
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-right"
                    required
                    dir="rtl"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* General Inspection Section - Flexbox Layout */}
        <div ref={generalRef} id="general-section" className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-[#091057]">בדיקה כללית</h2>
          {/* Header Row (visible on larger screens) */}
          <div className="hidden md:flex bg-[#024CAA] text-white p-2 rounded-t-md">
            <div className="flex-1 px-2 text-right font-bold">נושא</div>
            <div className="w-20 px-2 text-center font-bold">תקין</div>
            <div className="w-20 px-2 text-center font-bold">לא תקין</div>
            <div className="flex-1 px-2 text-right font-bold">הערות</div>
          </div>

          {/* Data Rows */}
          <div className="border border-[#DBD3D3] rounded-b-md md:border-t-0 md:rounded-t-none">
            {generalItems.map((item, index) => (
              <div
                key={item.id}
                className={twMerge(
                  "flex flex-col md:flex-row border-b border-[#DBD3D3] last:border-b-0 p-2",
                  index % 2 === 0 ? "bg-gray-50" : ""
                )}
              >
                {/* Topic (Full width on mobile, flexible on larger screens) */}
                <div className="flex-1 mb-2 md:mb-0 md:px-2 text-right">
                  <Label className="md:hidden font-bold">נושא: </Label>
                  {item.topic}
                </div>

                {/* Checkboxes (Side-by-side on mobile) */}
                <div className="flex justify-start md:justify-center items-center mb-2 md:mb-0 md:w-20 md:px-2">
                  <Label
                    htmlFor={`${item.id}-ok`}
                    className="md:hidden mr-2 font-bold"
                  >
                    תקין:
                  </Label>
                  <Checkbox
                    id={`${item.id}-ok`}
                    checked={item.isOk === true}
                    onCheckedChange={(checked) =>
                      handleGeneralItemChange(index, "isOk", checked)
                    }
                    className="mr-4 md:mr-0"
                  />
                </div>
                <div className="flex justify-start md:justify-center items-center mb-2 md:mb-0 md:w-20 md:px-2">
                  <Label
                    htmlFor={`${item.id}-notok`}
                    className="md:hidden mr-2 font-bold"
                  >
                    לא תקין:
                  </Label>
                  <Checkbox
                    id={`${item.id}-notok`}
                    checked={item.isNotOk === true}
                    onCheckedChange={(checked) =>
                      handleGeneralItemChange(index, "isNotOk", checked)
                    }
                  />
                </div>

                {/* Comments */}
                <div className="flex-1 md:px-2">
                  <Label
                    htmlFor={`${item.id}-comments`}
                    className="md:hidden font-bold"
                  >
                    הערות:
                  </Label>
                  <Textarea
                    id={`${item.id}-comments`}
                    value={item.comments}
                    onChange={(e) =>
                      handleGeneralItemChange(index, "comments", e.target.value)
                    }
                    className="w-full text-right resize-none overflow-visible h-auto"
                  />
                </div>
              </div>
            ))}

            {/* Manager General Notes */}
            <div className="bg-gray-100 p-4 rounded-b-md">
              <Label
                htmlFor="manager-general-notes"
                className="block mb-1 font-bold text-right leading-loose"
              >
                הערות מנהל אחזקה:
              </Label>
              <Textarea
                id="manager-general-notes"
                value={managerNotes.general}
                onChange={(e) =>
                  setManagerNotes({
                    ...managerNotes,
                    general: e.target.value,
                  })
                }
                className="w-full text-right resize-none overflow-visible h-auto"
                placeholder="הערות נוספות של מנהל האחזקה..."
              />
            </div>
          </div>
        </div>

        {/* Systems Inspection Section - Flexbox Layout */}
        <div ref={systemsRef} id="systems-section" className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-[#091057]">
            בדיקת מערכות
          </h2>
          {/* Header Row (visible on larger screens) */}
          <div className="hidden md:flex bg-[#024CAA] text-white p-2 rounded-t-md">
            <div className="flex-1 px-2 text-right font-bold">מערכת לבדיקה</div>
            <div className="w-20 px-2 text-center font-bold">תקין</div>
            <div className="w-20 px-2 text-center font-bold">לא תקין</div>
            <div className="flex-1 px-2 text-right font-bold">הערות</div>
          </div>

          {/* Data Rows */}
          <div className="border border-[#DBD3D3] rounded-b-md md:border-t-0 md:rounded-t-none">
            {systemItems.map((item, index) => (
              <div
                key={item.id}
                className={twMerge(
                  "flex flex-col md:flex-row border-b border-[#DBD3D3] last:border-b-0 p-2",
                  index % 2 === 0 && "bg-gray-50"
                )}
              >
                {/* Topic */}
                <div className="flex-1 mb-2 md:mb-0 md:px-2 text-right">
                  <Label className="md:hidden font-bold">מערכת: </Label>
                  {item.topic}
                </div>

                {/* Checkboxes */}
                <div className="flex justify-start md:justify-center items-center mb-2 md:mb-0 md:w-20 md:px-2">
                  <Label
                    htmlFor={`${item.id}-ok`}
                    className="md:hidden mr-2 font-bold"
                  >
                    תקין:
                  </Label>
                  <Checkbox
                    id={`${item.id}-ok`}
                    checked={item.isOk === true}
                    onCheckedChange={(checked) =>
                      handleSystemItemChange(index, "isOk", checked)
                    }
                    className="mr-4 md:mr-0"
                  />
                </div>
                <div className="flex justify-start md:justify-center items-center mb-2 md:mb-0 md:w-20 md:px-2">
                  <Label
                    htmlFor={`${item.id}-notok`}
                    className="md:hidden mr-2 font-bold"
                  >
                    לא תקין:
                  </Label>
                  <Checkbox
                    id={`${item.id}-notok`}
                    checked={item.isNotOk === true}
                    onCheckedChange={(checked) =>
                      handleSystemItemChange(index, "isNotOk", checked)
                    }
                  />
                </div>

                {/* Comments */}
                <div className="flex-1 md:px-2">
                  <Label
                    htmlFor={`${item.id}-comments`}
                    className="md:hidden font-bold"
                  >
                    הערות:
                  </Label>
                  <Textarea
                    id={`${item.id}-comments`}
                    value={item.comments}
                    onChange={(e) =>
                      handleSystemItemChange(index, "comments", e.target.value)
                    }
                    className="w-full text-right resize-none overflow-visible h-auto"
                  />
                </div>
              </div>
            ))}

            {/* Manager Systems Notes */}
            <div className="bg-gray-100 p-4 rounded-b-md">
              <Label
                htmlFor="manager-systems-notes"
                className="block mb-1 font-bold text-right leading-loose"
              >
                הערות מנהל אחזקה:
              </Label>
              <Textarea
                id="manager-systems-notes"
                value={managerNotes.systems}
                onChange={(e) =>
                  setManagerNotes({
                    ...managerNotes,
                    systems: e.target.value,
                  })
                }
                className="w-full text-right resize-none overflow-visible h-auto"
                placeholder="הערות נוספות של מנהל האחזקה..."
              />
            </div>
          </div>
        </div>

        {/* Submission Timestamp Display */}
        {submissionTime && (
          <div className="text-center mb-4 p-2 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600">
              זמן שליחת הטופס: {submissionTime}
            </p>
          </div>
        )}

        {/* Download Button */}
        <div className="flex flex-col items-center mt-8">
          <Button
            type="submit"
            className="bg-[#024CAA] hover:bg-[#024CAA]/90 text-white px-8 py-2 rounded-md flex items-center gap-2 text-lg"
            disabled={isGenerating || !selectedClient}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                מייצר PDF...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                הורד כ-PDF
              </>
            )}
          </Button>

          {!selectedClient && !isGenerating && (
            <p className="mt-2 text-red-500 text-sm">
              יש לבחור לקוח לפני הורדת ה-PDF
            </p>
          )}

          {errorMessage && (
            <div className="mt-4 p-4 rounded-md bg-red-100 text-red-800">
              {errorMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
