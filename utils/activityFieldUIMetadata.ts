export function getActivityFieldUIMetadata(value: any, fieldName?: string) {
  const htmlElement = "input";
  let label = "";
  const attrs = {
    value,
    type: "text",
  } as Record<string, any>
  const transformers = {
    input: (v: any) => v,
    output: (v: any) => v
  }
  const listeners = {} as Record<string, Function | null>

  switch(fieldName) {
    case 'occupation': {
      label = "Profissão";
    } break;
    case 'name': {
      label = "Nome Completo";
    } break;
    case 'age': {
      label = "Idade";
      attrs.type = "number";
      attrs.min = 1;
      attrs.max = 125;
    } break;
    case 'scholarity': {
      label = "Escolaridade";
      attrs.type = "number";
      attrs.min = 0;
      attrs.max = 30;
    } break;
  }
  return {
    htmlElement,
    attrs,
    transformers,
    listeners,
    label
  }
}