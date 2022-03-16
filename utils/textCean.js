import unidecode from "unidecode";

export function slugify(text) {
    text = text.replace('–','-')
    return unidecode(text)
  } 