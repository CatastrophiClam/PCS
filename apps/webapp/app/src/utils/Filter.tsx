import { Categories } from "../types/Data";

export const turnFiltersIntoQuery = (filters: Array<Categories>) => {
  return filters.reduce((query, currFilter, ind) => {
    if (ind !== 0) {
      query = `${query}&`;
    }
    if (Object.keys(currFilter).length == 0) {
      return query;
    }
    const queryBody = Object.keys(currFilter).reduce(
      (body, categoryGroup, i1) => {
        const partialQueryBody = Object.keys(currFilter[categoryGroup]).reduce(
          (pbody, category, i2) => {
            if (!(i1 === 0 && i2 === 0)) {
              pbody = `${pbody};`;
            }
            const values = currFilter[categoryGroup][category].reduce(
              (allVals, currVal, i3) => {
                if (i3 !== 0) {
                  allVals = `${allVals},`;
                }
                return `${allVals}${currVal}`;
              },
              ""
            );
            return `${pbody}${category}=${values}`;
          },
          ""
        );
        return `${body}${partialQueryBody}`;
      },
      ""
    );
    return `${query}c${ind}=${queryBody}`;
  }, "");
};
