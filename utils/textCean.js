import unidecode from "unidecode";

export function slugify(text) {
    return unidecode(text)
  } 