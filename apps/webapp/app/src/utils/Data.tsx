export const isFieldResultField = (fieldName: string, data: any) => {
  return data == null || typeof data !== "object";
};
