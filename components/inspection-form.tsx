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
import * as pdfMake from "pdfmake/build/pdfmake";

import { TDocumentDefinitions } from "pdfmake/interfaces";

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

  // טעינת הלקוחות של המנהל הנוכחי
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

  // פונקציה ליצירת ה-PDF
  const generatePDF = (formData: any) => {
    // בדיקה שה-pdfMake זמין
    if (!pdfMake) {
      throw new Error("pdfMake is not loaded");
    }

    // יצירת מערך של שורות טבלה עבור פריטי הבדיקה הכללית
    const generalItemsRows = formData.generalItems.map((item: any) => {
      const status = item.isOk ? "תקין" : item.isNotOk ? "לא תקין" : "לא נבדק";
      return [
        { text: item.topic, alignment: "right" },
        { text: status, alignment: "center" },
        { text: item.comments || "", alignment: "right" },
      ];
    });

    // יצירת מערך של שורות טבלה עבור פריטי בדיקת המערכות
    const systemItemsRows = formData.systemItems.map((item: any) => {
      const status = item.isOk ? "תקין" : item.isNotOk ? "לא תקין" : "לא נבדק";
      return [
        { text: item.topic, alignment: "right" },
        { text: status, alignment: "center" },
        { text: item.comments || "", alignment: "right" },
      ];
    });

    const docDefinition: TDocumentDefinitions = {
      // הגדרת כיוון המסמך מימין לשמאל
      // rtl: true,
      // הגדרת גופן ברירת מחדל
      defaultStyle: {
        font: "hebrew-font",
      },
      // תוכן המסמך
      content: [
        // כותרת ראשית
        {
          tocItem: "",
          text: "ים ניהול ואחזקה – סיור ביקורת",
          fontSize: 20,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        // פרטי הטופס
        {
          columns: [
            {
              width: "50%",
              text: [
                { text: "שם המנהל: ", bold: true },
                { text: formData.inspector || "", bold: false },
                { text: "\n" },
                { text: "תאריך: ", bold: true },
                { text: formData.date || "", bold: false },
              ],
              alignment: "right",
            },
            {
              width: "50%",
              text: [
                { text: "כתובת הבניין: ", bold: true },
                { text: formData.address || "", bold: false },
                { text: "\n" },
                { text: "זמן שליחת הטופס: ", bold: true },
                { text: formData.submissionTime || "", bold: false },
              ],
              alignment: "right",
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // כותרת בדיקה כללית
        {
          text: "בדיקה כללית",
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 10],
        },

        // טבלת בדיקה כללית
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "*"],
            body: [
              [
                { text: "נושא", style: "tableHeader", alignment: "right" },
                { text: "סטטוס", style: "tableHeader", alignment: "center" },
                { text: "הערות", style: "tableHeader", alignment: "right" },
              ],
              ...generalItemsRows,
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => "#aaa",
            vLineColor: () => "#aaa",
          },
        },

        // הערות מנהל אחזקה לבדיקה כללית
        // formData.managerNotes?.general
        //   ? {
        //       text: [
        //         { text: "הערות מנהל אחזקה: ", bold: true },
        //         { text: formData.managerNotes.general },
        //       ],
        //       margin: [0, 10, 0, 20],
        //     }
        //   : {},

        // כותרת בדיקת מערכות
        {
          text: "בדיקת מערכות",
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 10],
        },

        // טבלת בדיקת מערכות
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "*"],
            body: [
              [
                {
                  text: "מערכת לבדיקה",
                  style: "tableHeader",
                  alignment: "right",
                },
                { text: "סטטוס", style: "tableHeader", alignment: "center" },
                { text: "הערות", style: "tableHeader", alignment: "right" },
              ],
              ...systemItemsRows,
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => "#aaa",
            vLineColor: () => "#aaa",
          },
        },

        // הערות מנהל אחזקה לבדיקת מערכות
        // formData.managerNotes?.systems
        //   ? {
        //       text: [
        //         { text: "הערות מנהל אחזקה: ", bold: true },
        //         { text: formData.managerNotes.systems },
        //       ],
        //       margin: [0, 10, 0, 20],
        //     }
        //   : {},
      ],

      // סגנונות
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: "white",
          fillColor: "#024CAA",
        },
      },
    };

    // Create a filename with the current date and address
    const formattedDate = formData.date
      ? formData.date.replace(/-/g, "")
      : new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const sanitizedAddress = formData.address
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "_");
    const filename = `ביקורת_${sanitizedAddress}_${formattedDate}.pdf`;

    pdfMake.createPdf(docDefinition, undefined, fonts).download(filename);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);

    // יצירת timestamp נוכחי
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
      submissionTime: timestamp, // הוספת ה-timestamp לנתוני הטופס
    };

    try {
      // אימות הנתונים בשרת
      const result = await validateFormData(formData);

      if (result.success) {
        // בדיקה שה-pdfMake נטען
        if (!pdfMake) {
          throw new Error("pdfMake is not loaded. Please try again.");
        }

        // יצירת ה-PDF
        generatePDF(formData);
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
              src="/yamot-logo.png"
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
        <p className="mt-2 text-[#EC8305]">טופס ביקורת לבניינים</p>

        {/* כפתור התנתקות */}
        <div className="absolute top-4 left-4">
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
        {/* פרטי המנהל והבניין */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#024CAA] text-white">
                <th className="border border-[#DBD3D3] p-2 text-right">
                  פרטי המנהל
                </th>
                <th className="border border-[#DBD3D3] p-2 text-right">
                  פרטי הבניין ותאריך
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[#DBD3D3] p-4">
                  <div className="mb-2">
                    <Label htmlFor="manager" className="block mb-1">
                      שם המנהל:
                    </Label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      {managerName}
                    </div>
                  </div>
                </td>
                <td className="border border-[#DBD3D3] p-4">
                  <div className="mb-2">
                    <Label htmlFor="client" className="block mb-1">
                      שם הלקוח:
                    </Label>
                    <Select
                      value={selectedClient}
                      onValueChange={setSelectedClient}
                    >
                      <SelectTrigger className="w-full">
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
                    <Label htmlFor="date" className="block mb-1">
                      תאריך:
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* General Inspection Table */}
        <div className="mb-8 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4 text-[#091057]">בדיקה כללית</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#024CAA] text-white">
                <th className="border border-[#DBD3D3] p-2 text-right">נושא</th>
                <th className="border border-[#DBD3D3] p-2 w-20 text-center">
                  תקין
                </th>
                <th className="border border-[#DBD3D3] p-2 w-20 text-center">
                  לא תקין
                </th>
                <th className="border border-[#DBD3D3] p-2 text-right">
                  הערות
                </th>
              </tr>
            </thead>
            <tbody>
              {generalItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="border border-[#DBD3D3] p-2">{item.topic}</td>
                  <td className="border border-[#DBD3D3] p-2 text-center">
                    <Checkbox
                      id={`${item.id}-ok`}
                      checked={item.isOk === true}
                      onCheckedChange={(checked) =>
                        handleGeneralItemChange(index, "isOk", checked)
                      }
                    />
                  </td>
                  <td className="border border-[#DBD3D3] p-2 text-center">
                    <Checkbox
                      id={`${item.id}-notok`}
                      checked={item.isNotOk === true}
                      onCheckedChange={(checked) =>
                        handleGeneralItemChange(index, "isNotOk", checked)
                      }
                    />
                  </td>
                  <td className="border border-[#DBD3D3] p-2">
                    <Textarea
                      id={`${item.id}-comments`}
                      value={item.comments}
                      onChange={(e) =>
                        handleGeneralItemChange(
                          index,
                          "comments",
                          e.target.value
                        )
                      }
                      className="w-full min-h-[40px]"
                    />
                  </td>
                </tr>
              ))}
              {/* שורה להערות מנהל אחזקה */}
              <tr className="bg-gray-100">
                <td colSpan={4} className="border border-[#DBD3D3] p-2">
                  <Label
                    htmlFor="manager-general-notes"
                    className="block mb-1 font-bold"
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
                    className="w-full min-h-[80px]"
                    placeholder="הערות נוספות של מנהל האחזקה..."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Systems Inspection Table */}
        <div className="mb-8 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4 text-[#091057]">
            בדיקת מערכות
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#024CAA] text-white">
                <th className="border border-[#DBD3D3] p-2 text-right">
                  מערכת לבדיקה
                </th>
                <th className="border border-[#DBD3D3] p-2 w-20 text-center">
                  תקין
                </th>
                <th className="border border-[#DBD3D3] p-2 w-20 text-center">
                  לא תקין
                </th>
                <th className="border border-[#DBD3D3] p-2 text-right">
                  הערות
                </th>
              </tr>
            </thead>
            <tbody>
              {systemItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="border border-[#DBD3D3] p-2">{item.topic}</td>
                  <td className="border border-[#DBD3D3] p-2 text-center">
                    <Checkbox
                      id={`${item.id}-ok`}
                      checked={item.isOk === true}
                      onCheckedChange={(checked) =>
                        handleSystemItemChange(index, "isOk", checked)
                      }
                    />
                  </td>
                  <td className="border border-[#DBD3D3] p-2 text-center">
                    <Checkbox
                      id={`${item.id}-notok`}
                      checked={item.isNotOk === true}
                      onCheckedChange={(checked) =>
                        handleSystemItemChange(index, "isNotOk", checked)
                      }
                    />
                  </td>
                  <td className="border border-[#DBD3D3] p-2">
                    <Textarea
                      id={`${item.id}-comments`}
                      value={item.comments}
                      onChange={(e) =>
                        handleSystemItemChange(
                          index,
                          "comments",
                          e.target.value
                        )
                      }
                      className="w-full min-h-[40px]"
                    />
                  </td>
                </tr>
              ))}
              {/* שורה להערות מנהל אחזקה */}
              <tr className="bg-gray-100">
                <td colSpan={4} className="border border-[#DBD3D3] p-2">
                  <Label
                    htmlFor="manager-systems-notes"
                    className="block mb-1 font-bold"
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
                    className="w-full min-h-[80px]"
                    placeholder="הערות נוספות של מנהל האחזקה..."
                  />
                </td>
              </tr>
            </tbody>
          </table>
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
