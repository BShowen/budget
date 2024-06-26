// A simple module for formatting the dates used throughout the app.
export const dates = (() => {
  // const date = new Date();

  // Format a date to be used as the default value in an HTML form date input.
  // Returns YYYY-MM-DD
  function forHtml(date) {
    const [month, day, year] = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    })
      .format(date)
      .split("/");
    return `${year}-${month}-${day}`;
  }

  // Format a date to be used as the page header date.
  function forPageHeader(date) {
    if (!(date instanceof Date)) {
      throw new Error(`${date} must be instance of Date.`);
    }
    return date.toLocaleString("en-us", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  function forTransaction(date) {
    if (!(date instanceof Date)) {
      throw new Error(`${date} must be instance of Date.`);
    }

    return date.toLocaleString("en-us", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  function forTransactionDetails(date) {
    if (!(date instanceof Date)) {
      throw new Error(`${date} must be instance of Date.`);
    }

    return date.toLocaleString("en-us", {
      month: "long",
      day: "numeric",
      weekday: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  function forAllocation(date) {
    if (!(date instanceof Date)) {
      throw new Error(`${date} must be instance of Date.`);
    }

    return date.toLocaleString("en-us", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  function format(date, args) {
    if (!(date instanceof Date) && args === undefined) {
      // If only the options object is provided
      args = date;
      date = undefined;
    }

    const defaultOptions = {
      forHtml: false,
      forPageHeader: false,
      forTransaction: false,
      forAllocation: false,
      forTransactionDetails: false,
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
        return forHtml(date);
      case "forPageHeader":
        return forPageHeader(date);
      case "forTransaction":
        return forTransaction(date);
      case "forAllocation":
        return forAllocation(date);
      case "forTransactionDetails":
        return forTransactionDetails(date);
    }
  }

  return { format };
})();
