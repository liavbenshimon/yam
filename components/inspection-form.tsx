"use client";

import type React from "react";

import { useState, useEffect } from "react";

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
      comments: "טיפול מונע בסוף כל שנה",
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
      comments: "",
    },
    {
      id: "sprinklers",
      topic: "ספרינקלרים – בדק ויזואלי לאיתור נזילות",
      isOk: null,
      isNotOk: null,
      comments: "",
    },
    {
      id: "fans",
      topic: "מפוחים – הפעלה חודשית",
      isOk: null,
      isNotOk: null,
      comments: "",
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

  // Function to generate the PDF
  const generatePDF = async (
    formData: any,
    generalSectionEl: HTMLElement,
    systemsSectionEl: HTMLElement
  ) => {
    // Create a new jsPDF instance with RTL support
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    // Add metadata to the first page
    doc.addImage("/yamlogo.jpg", "PNG", 10, 10, 50, 50);
    doc.addFont("NotoSansHebrew.ttf", "NotoSansHebrew", "normal");
    doc.setFont("NotoSansHebrew");
    doc.setR2L(true); // Set right-to-left for Hebrew text

    // Document title
    doc.setFontSize(20);
    doc.text(
      "ים ניהול ואחזקה – סיור ביקורת",
      doc.internal.pageSize.width / 2,
      20,
      { align: "center" }
    );

    // Form details
    doc.setFontSize(12);
    doc.text(`שם המנהל: ${formData.inspector}`, 190, 40, { align: "right" });
    doc.text(`תאריך: ${formData.date}`, 190, 48, { align: "right" });
    doc.text(`כתובת הבניין: ${formData.address}`, 190, 56, { align: "right" });
    doc.text(`זמן שליחת הטופס: ${submissionTime}`, 190, 64, {
      align: "right",
    });

    // Capture the general section as an image
    const generalCanvas = await html2canvas(generalSectionEl);
    const generalImgData = generalCanvas.toDataURL("image/png");
    const imgWidth = 190; // Fit within the page width
    const imgHeight = (generalCanvas.height * imgWidth) / generalCanvas.width; // Maintain aspect ratio

    // Add the general section image to the PDF
    doc.addImage(generalImgData, "PNG", 10, 80, imgWidth, imgHeight);

    // Add a new page for the systems section
    doc.addPage();

    // Capture the systems section as an image
    const systemsCanvas = await html2canvas(systemsSectionEl);
    const systemsImgData = systemsCanvas.toDataURL("image/png");
    const systemsImgHeight =
      (systemsCanvas.height * imgWidth) / systemsCanvas.width; // Maintain aspect ratio

    // Add the systems section image to the PDF
    doc.addImage(systemsImgData, "PNG", 10, 10, imgWidth, systemsImgHeight);

    // Create a filename with the current date and address
    const formattedDate = formData.date
      ? formData.date.replace(/-/g, "")
      : new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const sanitizedAddress = formData.address
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "_");
    const filename = `ביקורת_${sanitizedAddress}_${formattedDate}.pdf`;

    // Save the PDF
    doc.save(filename);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);

    // Create a current timestamp
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
      // Data validation on the server
      const result = await validateFormData(formData);

      if (result.success) {
        // Generating the PDF
        const generalSectionEl = document.getElementById("general-section");
        const systemsSectionEl = document.getElementById("systems-section");

        if (generalSectionEl && systemsSectionEl) {
          await generatePDF(formData, generalSectionEl, systemsSectionEl);
        } else {
          throw new Error("Missing sections for PDF generation");
        }
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

        {/* /* Logout Button */}
        <div className="">
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
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-6">
        {/* פרטי המנהל והבניין - Flexbox Layout */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Manager Details */}
          <div className="flex-1 border border-[#DBD3D3] rounded-md p-4">
            <div className="bg-[#024CAA] text-white p-2 rounded-t-md -m-4 mb-4">
              <h3 className="font-bold text-right">פרטי המנהל</h3>
            </div>
            <div className="mb-2">
              <Label htmlFor="manager" className="block mb-1 text-right">
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
              <Label htmlFor="client" className="block mb-1 text-right">
                שם הלקוח:
              </Label>
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
            </div>
            <div>
              <Label htmlFor="date" className="block mb-1 text-right">
                תאריך:
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-right"
                required
                dir="rtl" // Hint for date picker alignment if needed
              />
            </div>
          </div>
        </div>

        {/* General Inspection Section - Flexbox Layout */}
        <div id="general-section" className="mb-8">
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
                    className="w-full min-h-[40px] text-right"
                  />
                </div>
              </div>
            ))}

            {/* Manager General Notes */}
            <div className="bg-gray-100 p-4 rounded-b-md">
              <Label
                htmlFor="manager-general-notes"
                className="block mb-1 font-bold text-right"
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
                className="w-full min-h-[80px] text-right"
                placeholder="הערות נוספות של מנהל האחזקה..."
              />
            </div>
          </div>
        </div>

        {/* Systems Inspection Section - Flexbox Layout */}
        <div id="systems-section" className="mb-8">
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
                    className="w-full min-h-[40px] text-right"
                  />
                </div>
              </div>
            ))}

            {/* Manager Systems Notes */}
            <div className="bg-gray-100 p-4 rounded-b-md">
              <Label
                htmlFor="manager-systems-notes"
                className="block mb-1 font-bold text-right"
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
                className="w-full min-h-[80px] text-right"
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
