"use server"

import type { TDocumentDefinitions } from "pdfmake/interfaces"

export async function validateFormData(formData: any) {
  try {
    // בדיקת תקינות הנתונים (אופציונלי)
    if (!formData.inspector || !formData.address || !formData.date) {
      return {
        success: false,
        error: "חסרים נתונים בסיסיים בטופס",
      }
    }

    // החזרת הנתונים המאומתים
    return {
      success: true,
      formData,
    }
  } catch (error) {
    console.error("Error validating form data:", error)
    return {
      success: false,
      error: "אירעה שגיאה באימות הנתונים. אנא נסה שנית.",
    }
  }
}

export async function generatePdf(formData: any) {
  try {
    // יצירת מערך של שורות טבלה עבור פריטי הבדיקה הכללית
    const generalItemsRows = formData.generalItems.map((item: any) => {
      const status = item.isOk ? "תקין" : item.isNotOk ? "לא תקין" : "לא נבדק"
      return [
        { text: item.topic, alignment: "right" },
        { text: status, alignment: "center" },
        { text: item.comments || "", alignment: "right" },
      ]
    })

    // יצירת מערך של שורות טבלה עבור פריטי בדיקת המערכות
    const systemItemsRows = formData.systemItems.map((item: any) => {
      const status = item.isOk ? "תקין" : item.isNotOk ? "לא תקין" : "לא נבדק"
      return [
        { text: item.topic, alignment: "right" },
        { text: status, alignment: "center" },
        { text: item.comments || "", alignment: "right" },
      ]
    })

    // הגדרת מסמך ה-PDF
    const docDefinition: TDocumentDefinitions = {
      // הגדרת כיוון המסמך מימין לשמאל
      rtl: true,
      // הגדרת גופן ברירת מחדל
      defaultStyle: {
        font: "Arial",
      },
      // תוכן המסמך
      content: [
        // כותרת ראשית
        {
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
        formData.managerNotes?.general
          ? {
              text: [{ text: "הערות מנהל אחזקה: ", bold: true }, { text: formData.managerNotes.general }],
              margin: [0, 10, 0, 20],
            }
          : {},

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
                { text: "מערכת לבדיקה", style: "tableHeader", alignment: "right" },
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
        formData.managerNotes?.systems
          ? {
              text: [{ text: "הערות מנהל אחזקה: ", bold: true }, { text: formData.managerNotes.systems }],
              margin: [0, 10, 0, 20],
            }
          : {},
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
    }

    // נחזיר את הגדרות המסמך לקליינט שם נייצר את ה-PDF
    return {
      success: true,
      docDefinition: docDefinition,
    }
  } catch (error) {
    console.error("Error preparing PDF definition:", error)
    return {
      success: false,
      error: "אירעה שגיאה בהכנת ה-PDF. אנא נסה שנית.",
    }
  }
}
