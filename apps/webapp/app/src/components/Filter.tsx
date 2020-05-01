import React from "react";
import { Categories } from "../types/Data";
import { X } from "react-feather";
import {
  FilterWrapper,
  CategoryWithOptions,
  CategoryName,
  CategoryOptions,
  CategoryContentWrapper,
  XWrapper,
} from "./styles/Filter";

interface FilterProps {
  filter: Categories;
  onClickX?: (event: React.MouseEvent) => void;
}

const Filter = ({ filter, onClickX }: FilterProps) => {
  if (Object.keys(filter).length == 0) {
    return null;
  }
  return (
    <FilterWrapper>
      <CategoryContentWrapper>
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
      </CategoryContentWrapper>
      {onClickX && (
        <XWrapper>
          <X onClick={onClickX} />
        </XWrapper>
      )}
    </FilterWrapper>
  );
};

export default Filter;
