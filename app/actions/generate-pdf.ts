"use server";

export async function validateFormData(formData: any) {
  try {
    // בדיקת תקינות הנתונים (אופציונלי)
    if (!formData.inspector || !formData.address || !formData.date) {
      return {
        success: false,
        error: "חסרים נתונים בסיסיים בטופס",
      };
    }

    // החזרת הנתונים המאומתים
    return {
      success: true,
      formData,
    };
  } catch (error) {
    console.error("Error validating form data:", error);
    return {
      success: false,
      error: "אירעה שגיאה באימות הנתונים. אנא נסה שנית.",
    };
  }
}
