import dayjs from "dayjs";

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export function deleteValueByIndex<T>(arr: T[], index: number): T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}


export enum taskVariety {
  Assignment = "Assignment",
  Lecture = "Lecture",
  Lab = "Lab",
  Exam = "Exam",
  Other = "Other",
}

export enum taskPriority {
  High = "High",
  Medium = "Medium",
  Low = "Low",
}

export const niceDate = (d: string | Date | dayjs.Dayjs): string => {
  const mm = new Date(d.toLocaleString()).toLocaleString("default", {
    month: "short",
  });
  const dd = new Date(d.toLocaleString()).toLocaleString("default", {
    day: "2-digit",
  });

  const tt = new Date(d.toLocaleString()).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return `${mm} ${dd} ${tt}`;
};

export function updateArrayWithNewString(array: string[], newString: string): string[] {
  const index = array.indexOf(newString);
  if (index === -1) {
    // If the new string wasn't in the array, add it
    return [...array, newString];
  } else {
    // If the new string was already in the array, remove it
    return array.filter((str) => str !== newString);
  }
}


export function replaceStringInArray(arr: string[], oldStr: string, newStr: string): string[] {
  const index = arr.indexOf(oldStr);
  if (index !== -1) {
    arr[index] = newStr;
  }
  return arr;
}