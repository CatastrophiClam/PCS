import React from "react";
import { Categories } from "../types/Data";
import {
  FilterWrapper,
  CategoryWithOptions,
  CategoryName,
  CategoryOptions,
} from "./styles/Filter";

interface FilterProps {
  filter: Categories;
}

const Filter = ({ filter }: FilterProps) => {
  if (Object.keys(filter).length == 0) {
    return null;
  }
  return (
    <FilterWrapper>
      {Object.keys(filter).map((categoryGroup) =>
        Object.keys(filter[categoryGroup]).map((category) => (
          <CategoryWithOptions key={`${categoryGroup}${category}`}>
            <CategoryName>{category}:</CategoryName>
            <CategoryOptions>
              {filter[categoryGroup][category].reduce(
                (acc: string, curr: any, ind: number) => {
                  if (ind != 0) {
                    acc = `${acc},`;
                  }
                  acc = `${acc}${curr}`;
                  return acc;
                },
                ""
              )}
            </CategoryOptions>
          </CategoryWithOptions>
        ))
      )}
    </FilterWrapper>
  );
};

export default Filter;
