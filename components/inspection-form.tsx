"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";

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
import { autoTable } from "jspdf-autotable";
import "../fonts/NotoSansHebrew";
import { twMerge } from "tailwind-merge";

// First checklist items
const initialGeneralItems: CheckItem[] = [
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
    topic: "ניקיון כללי של הלובי + מעליות + מסילות מעליות + תיבות דואר+ חלונות",
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
];

// Systems checklist items
const initialSystemItems: CheckItem[] = [
  {
    id: "generator",
    topic: "גנרטור – הנעה חודשית + מצב סולר",
    isOk: null,
    isNotOk: null,
    comments: "טיפול מונע בסוף כל שנה, בדיקה אחת לשנה על ידי טכנאי מוסמך",
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
    comments: "בדיקה אחת לשנה על ידי טכנאי מוסמך",
  },
  {
    id: "sprinklers",
    topic: "ספרינקלרים – בדק ויזואלי לאיתור נזילות",
    isOk: null,
    isNotOk: null,
    comments: "בדיקה אחת לשנה על ידי טכנאי מוסמך",
  },
  {
    id: "fans",
    topic: "מפוחים – הפעלה חודשית",
    isOk: null,
    isNotOk: null,
    comments: "בדיקה אחת לשנה על ידי טכנאי מוסמך",
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
];

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
  const [availableClients, setAvailableClients] = useState<string[]>([]);
  const [submissionTime, setSubmissionTime] = useState<string>("");

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

  // Loading the current manager's clients
  useEffect(() => {
    const manager = getManagerById(managerId);
    if (manager) {
      setAvailableClients(manager.clients);
    }
  }, [managerId]);

  const generatePDF = async (formValues: any) => {
    setIsPrinting(true);

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true,
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    doc.setR2L(true);
    doc.setFont("NotoSansHebrew");

    const addText = (text: string, x: number, y: number, options?: any) => {
      doc.text(text, x, y, { lang: "he", align: "right", ...options });
    };

    const lineHeight = 7;
    const margin = 14;
    let currentY = margin;

    try {
      const imgData = "/yamlogo.jpg"; // Path to your logo
      doc.addImage(imgData, "JPEG", margin, currentY, 40, 40);
    } catch (e) {
      console.warn(
        "Logo could not be added. Ensure it's accessible and in a supported format.",
        e
      );
    }

    doc.setFontSize(18);
    addText("ים ניהול ואחזקה – סיור ביקורת", 210 - margin, currentY);
    currentY += lineHeight;
    doc.setFontSize(12);
    doc.setTextColor(236, 131, 5); // #EC8305
    addText("מצוינות במבחן היומיומי", 210 - margin, currentY);
    doc.setTextColor(0, 0, 0); // Reset color
    currentY += lineHeight * 2;

    currentY += lineHeight;
    addText(`שם המנהל: ${managerName}`, 210 - margin, currentY);
    currentY += lineHeight * 1.5;

    // Building and Date Details
    addText("פרטי הבניין ותאריך:", 210 - margin, currentY, {
      fontSize: 14,
      fontStyle: "bold",
    });
    currentY += lineHeight;
    addText(`שם הלקוח: ${formValues.selectedClient}`, 210 - margin, currentY);
    currentY += lineHeight;
    addText(
      `תאריך: ${formatDateForDisplay(formValues.date)}`,
      210 - margin,
      currentY
    );
    currentY += lineHeight * 2;

    // Function to add a table for checklist items
    const addChecklistTable = (
      title: string,
      items: CheckItem[],
      notes: string
    ) => {
      if (currentY > 260) {
        // Check if new page is needed
        doc.addPage();
        currentY = margin;
      }
      doc.setFontSize(16);
      addText(title, 210 - margin, currentY);
      currentY += lineHeight * 1.5;

      const head = [
        {
          content: "הערות",
          styles: {
            halign: "right" as const,
            font: "NotoSansHebrew",
            fontStyle: "normal",
          },
        },
        {
          content: "לא תקין",
          styles: {
            halign: "center" as const,
            font: "NotoSansHebrew",
            fontStyle: "normal",
          },
        },
        {
          content: "תקין",
          styles: {
            halign: "center" as const,
            font: "NotoSansHebrew",
            fontStyle: "normal",
          },
        },
        {
          content: "נושא",
          styles: {
            halign: "right" as const,
            font: "NotoSansHebrew",
            fontStyle: "normal",
          },
        },
      ];

      const body = items.map((item) => [
        {
          content: item.comments,
          styles: { halign: "right" as const, font: "NotoSansHebrew" },
        },
        {
          content: item.isNotOk ? "X" : "",
          styles: { halign: "center" as const, font: "NotoSansHebrew" },
        },
        {
          content: item.isOk ? "X" : "",
          styles: { halign: "center" as const, font: "NotoSansHebrew" },
        },
        {
          content: item.topic,
          styles: { halign: "right" as const, font: "NotoSansHebrew" },
        },
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [head],
        body: body,
        theme: "grid",
        headStyles: {
          fillColor: [2, 76, 170],
          textColor: 255,
          font: "NotoSansHebrew",
          halign: "right" as const,
        }, // #024CAA
        bodyStyles: { font: "NotoSansHebrew", halign: "right" as const },
        columnStyles: {
          0: { cellWidth: 80 }, // Comments
          1: { cellWidth: 20 }, // Not Ok
          2: { cellWidth: 20 }, // Ok
          3: { cellWidth: "auto" }, // Topic
        },
        didDrawPage: (data: any) => {
          currentY = data.cursor.y + margin / 2;
        },
        margin: { right: margin, left: margin },
      });
      currentY = (doc as any).lastAutoTable.finalY + lineHeight;

      if (notes) {
        if (currentY > 270) {
          doc.addPage();
          currentY = margin;
        }
        addText("הערות מנהל אחזקה:", 210 - margin, currentY, {
          fontSize: 12,
          fontStyle: "bold",
        });
        currentY += lineHeight;
        // Use splitTextToSize for multi-line text
        const notesLines = doc.splitTextToSize(notes, 210 - margin * 2);
        addText(notesLines.join("\n"), 210 - margin, currentY);
        currentY += notesLines.length * lineHeight + lineHeight;
      }
    };

    // General Inspection Section
    addChecklistTable(
      "בדיקה כללית",
      formValues.generalItems,
      formValues.managerNotes.general
    );

    // Systems Inspection Section
    // Add a page break if there's not enough space for the next table header + some rows

    currentY = margin;
    doc.addPage();
    addChecklistTable(
      "בדיקת מערכות",
      formValues.systemItems,
      formValues.managerNotes.systems
    );

    const filename = `inspection_${new Date().toISOString().slice(0, 10)}.pdf`;

    doc.save(filename);

    setIsPrinting(false);
  };

  // The submit function remains almost the same
  const handleSubmit = async (values: any) => {
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
      address: values.selectedClient,
      date: values.date,
      generalItems: values.generalItems,
      systemItems: values.systemItems,
      managerNotes: values.managerNotes,
    };

    try {
      const result = await validateFormData(formData);

      if (result.success) {
        await generatePDF(values);
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
    }
  };

  return (
    <Formik
      initialValues={{
        selectedClient: "",
        date: "",
        managerNotes: {
          general: "",
          systems: "",
        },
        generalItems: initialGeneralItems,
        systemItems: initialSystemItems,
      }}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <div
          className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
          dir="rtl"
        >
          <Form className="p-4 md:p-6">
            <div className="rounded-lg overflow-hidden">
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
                      <p className="text-right">{values.selectedClient}</p>
                    ) : (
                      <Select
                        value={values.selectedClient}
                        onValueChange={(value) =>
                          setFieldValue("selectedClient", value)
                        }
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
                    {isSubmitting ? (
                      <p className="text-right">
                        {formatDateForDisplay(values.date)}
                      </p>
                    ) : (
                      <Field
                        as={Input}
                        id="date"
                        name="date"
                        type="date"
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
            <div id="general-section" className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-[#091057]">
                בדיקה כללית
              </h2>
              {/* Header Row (visible on larger screens) */}
              <div className="hidden md:flex bg-[#024CAA] text-white p-2 rounded-t-md">
                <div className="flex-1 px-2 text-right font-bold">נושא</div>
                <div className="w-20 px-2 text-center font-bold">תקין</div>
                <div className="w-20 px-2 text-center font-bold">לא תקין</div>
                <div className="flex-1 px-2 text-right font-bold">הערות</div>
              </div>

              {/* Data Rows */}
              <div className="border border-[#DBD3D3] rounded-b-md md:border-t-0 md:rounded-t-none">
                {values.generalItems.map((item, index) => (
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
                        onCheckedChange={(checked) => {
                          setFieldValue(
                            `generalItems.${index}.isOk`,
                            checked ? true : null
                          );
                          if (checked)
                            setFieldValue(
                              `generalItems.${index}.isNotOk`,
                              false
                            );
                        }}
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
                        onCheckedChange={(checked) => {
                          setFieldValue(
                            `generalItems.${index}.isNotOk`,
                            checked ? true : null
                          );
                          if (checked)
                            setFieldValue(`generalItems.${index}.isOk`, false);
                        }}
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
                      <Field
                        as={Textarea}
                        id={`${item.id}-comments`}
                        name={`generalItems.${index}.comments`}
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
                  <Field
                    as={Textarea}
                    id="manager-general-notes"
                    name="managerNotes.general"
                    className="w-full text-right resize-none overflow-visible h-auto"
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
                <div className="flex-1 px-2 text-right font-bold">
                  מערכת לבדיקה
                </div>
                <div className="w-20 px-2 text-center font-bold">תקין</div>
                <div className="w-20 px-2 text-center font-bold">לא תקין</div>
                <div className="flex-1 px-2 text-right font-bold">הערות</div>
              </div>

              {/* Data Rows */}
              <div className="border border-[#DBD3D3] rounded-b-md md:border-t-0 md:rounded-t-none">
                {values.systemItems.map((item, index) => (
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
                        onCheckedChange={(checked) => {
                          setFieldValue(
                            `systemItems.${index}.isOk`,
                            checked ? true : null
                          );
                          if (checked)
                            setFieldValue(
                              `systemItems.${index}.isNotOk`,
                              false
                            );
                        }}
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
                        onCheckedChange={(checked) => {
                          setFieldValue(
                            `systemItems.${index}.isNotOk`,
                            checked ? true : null
                          );
                          if (checked)
                            setFieldValue(`systemItems.${index}.isOk`, false);
                        }}
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
                      <Field
                        as={Textarea}
                        id={`${item.id}-comments`}
                        name={`systemItems.${index}.comments`}
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
                  <Field
                    as={Textarea}
                    id="manager-systems-notes"
                    name="managerNotes.systems"
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
                disabled={isSubmitting || !values.selectedClient}
              >
                {isSubmitting ? (
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

              {!values.selectedClient && !isSubmitting && (
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
          </Form>
        </div>
      )}
    </Formik>
  );
}
