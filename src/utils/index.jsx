export const getValidEmails = (emailInput) => {
  let result = [];
  if (!emailInput || emailInput.trim() === '') {
    return result;
  }
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  const emails = emailInput.trim().replace(/[;\s]/g, ',').split(',');

  for (let i = 0; i < emails.length; i++) {
    const e = emails[i];
    if (e === '') {continue;}

    if (regex.test(e)) {
      result.push(e);
    }
    else {
      result = [];
      break;
    }
  }
  
  return result;
}

export const getNameEmail = (value) => {
  if (!value) {return null;}
  
  const regex = /(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/;
  let m, name, email;
  if ((m = regex.exec(value)) !== null) {
    email = m[2];
    name = m[1] || email.slice(0, email.indexOf("@"));
  }
  return { name, email };
}