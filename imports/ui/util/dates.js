// A simple module for formatting the dates used throughout the app.
export const dates = (() => {
  const date = new Date();

  // Format a date to be used as the default value in an HTML form date input.
  // Returns YYYY-MM-DD
  function forHtml() {
    const [month, day, year] = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(date)
      .split("/");
    return `${year}-${month}-${day}`;
  }

  // Format a date to be used as the page header date.
  function forPageHeader() {
    return date.toLocaleString("en-us", {
      month: "long",
      year: "numeric",
    });
  }

  function forTransaction(date) {
    if (!(date instanceof Date)) {
      throw new Error(`${date} must be instance of Date.`);
    }

    return date.toLocaleString("en-us", { month: "short", day: "numeric" });
  }

  function format(date, args = {}) {
    if (!(date instanceof Date)) {
      // If only the options object is provided
      args = date;
      date = undefined;
    }

    const defaultOptions = {
      forHtml: false,
      forPageHeader: false,
      forTransaction: false,
    };

    const options = {
      ...defaultOptions,
      ...args,
    };

    const formatOption = Object.keys(
      Object.fromEntries(
        Object.entries(options).filter((option) => {
          const [filterName, boolean] = option;
          return boolean && Object.keys(defaultOptions).includes(filterName);
        })
      )
    )[0];

    if (formatOption === undefined) {
      throw new Error(`Invalid format option: ${JSON.stringify(options)}`);
    }

    switch (formatOption) {
      case "forHtml":
        return forHtml();
      case "forPageHeader":
        return forPageHeader();
      case "forTransaction":
        return forTransaction(date);
    }
  }

  return { format };
})();
