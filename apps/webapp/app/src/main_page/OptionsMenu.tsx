import React, { useState, useEffect, useRef } from "react";
import { withTheme, DefaultTheme } from "styled-components";
import Select from "react-select";
import {
  OptionsMenuWrapper,
  CreateFilterSectionWrapper,
  AllFiltersSectionWrapper,
  CreateFilterSectionHeader,
  AllCategoryGroupsWrapper,
  CategoryGroupWrapper,
  CategoryGroupHeader,
  CategoryName,
  AllFiltersHeader,
  CurrentFilterSectionWrapper,
  CurrentFilterHeader,
  FilterWrapper,
  CurrentFilterInfoText,
} from "./styles/OptionsMenu";
import { Categories } from "../types/Data";
import { SELECT } from "../constants/Select";
import Filter from "../components/Filter";
import Button from "../components/Button";
import { getDataCount } from "../utils/Api";
import { turnFiltersIntoQuery } from "../utils/Filter";

interface OptionsMenuProps {
  filters: Array<Categories>;
  categories: Categories;
  setFilters: Function;
  theme: DefaultTheme;
}

const customStyles = {
  container: (provided: any, state: any) => ({
    ...provided,
    width: state.selectProps.width,
  }),
};

const OptionsMenu = ({
  filters,
  categories,
  setFilters,
  theme,
}: OptionsMenuProps) => {
  const [currentFilter, setCurrentFilter] = useState<Categories>({});
  const [currentFilterDataCount, setCurrentFilterDataCount] = useState<number>(
    0
  );
  const [prevFilter, setPrevFilter] = useState<Categories>({});
  const [
    shouldRealizeCurrentFilterChanges,
    setShouldRealizeCurrentFilterChanges,
  ] = useState(false);

  const addCurrentFilter = () => {
    if (Object.keys(currentFilter).length > 0) {
      const newFilters = [...filters, currentFilter];
      setCurrentFilter({});
      setFilters(newFilters);
    }
  };

  const removeFilter = (ind: number) => {
    const newFilters = [...filters].filter((_, i) => {
      return i != ind;
    });
    setFilters(newFilters);
  };

  const onSelectChangeMaker = (categoryGroup: string, category: string) => {
    const onSelectChange = (obj: any, info: any) => {
      let nextFilter: Categories = { ...currentFilter };
      switch (info.action) {
        case SELECT.SELECT_OPTION:
          if (!nextFilter[categoryGroup]) {
            nextFilter[categoryGroup] = {};
          }
          if (!nextFilter[categoryGroup][category]) {
            nextFilter[categoryGroup][category] = [];
          }
          nextFilter[categoryGroup][category].push(info.option.value);
          break;
        case SELECT.POP_VALUE:
        case SELECT.REMOVE_VALUE:
          nextFilter[categoryGroup][category] = nextFilter[categoryGroup][
            category
          ].filter((option) => option != info.removedValue.value);
          if (nextFilter[categoryGroup][category].length == 0) {
            delete nextFilter[categoryGroup][category];
          }
          if (Object.keys(nextFilter[categoryGroup]).length == 0) {
            delete nextFilter[categoryGroup];
          }
          break;
        case SELECT.CLEAR:
          delete nextFilter[categoryGroup];
      }
      setCurrentFilter(nextFilter);
    };
    return onSelectChange;
  };

  const handleCurrentFilterChange = async () => {
    if (prevFilter != currentFilter) {
      const [data, status] = await getDataCount(
        turnFiltersIntoQuery([currentFilter])
      );
      setCurrentFilterDataCount(data.count);
      setPrevFilter(currentFilter);
    }
    setShouldRealizeCurrentFilterChanges(false);
  };

  useEffect(() => {
    handleCurrentFilterChange();
  }, [currentFilter, prevFilter]);

  const onMenuClose = () => {
    setShouldRealizeCurrentFilterChanges(true);
  };

  return (
    <OptionsMenuWrapper>
      <CreateFilterSectionWrapper>
        <CreateFilterSectionHeader>Create Filter</CreateFilterSectionHeader>
        <AllCategoryGroupsWrapper>
          {Object.keys(categories).map((categoryGroup) => {
            return (
              <CategoryGroupWrapper key={`${categoryGroup}`}>
                <CategoryGroupHeader>{categoryGroup}</CategoryGroupHeader>
                <table>
                  <tbody>
                    {Object.keys(categories[categoryGroup]).map((category) => {
                      return (
                        <tr key={`${categoryGroup}${category}`}>
                          <CategoryName>{category}</CategoryName>
                          <td>
                            <Select
                              closeMenuOnSelect={false}
                              onMenuClose={onMenuClose}
                              value={
                                currentFilter[categoryGroup] &&
                                currentFilter[categoryGroup][category]
                                  ? currentFilter[categoryGroup][category].map(
                                      (option) => ({
                                        value: option,
                                        label: option,
                                        categoryGroup: categoryGroup,
                                        category: category,
                                      })
                                    )
                                  : []
                              }
                              onChange={onSelectChangeMaker(
                                categoryGroup,
                                category
                              )}
                              styles={customStyles}
                              isMulti
                              options={categories[categoryGroup][category].map(
                                (option) => ({
                                  value: option,
                                  label: option,
                                  categoryGroup: categoryGroup,
                                  category: category,
                                })
                              )}
                              width={285}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CategoryGroupWrapper>
            );
          })}
        </AllCategoryGroupsWrapper>
        <CurrentFilterSectionWrapper>
          <CurrentFilterHeader>Current Filter</CurrentFilterHeader>
          <Filter filter={currentFilter} />
          {Object.keys(currentFilter).length != 0 && (
            <CurrentFilterInfoText>
              {`Current filter produces ${currentFilterDataCount} results`}
            </CurrentFilterInfoText>
          )}
          <Button
            width="160px"
            margin="16px 0 0 0"
            handleClick={addCurrentFilter}
          >
            Add filter
          </Button>
        </CurrentFilterSectionWrapper>
      </CreateFilterSectionWrapper>
      <AllFiltersSectionWrapper>
        <AllFiltersHeader>All Active Filters</AllFiltersHeader>
        {filters.map((filter, ind) => (
          <FilterWrapper key={ind}>
            <Filter filter={filter} onClickX={() => removeFilter(ind)} />
          </FilterWrapper>
        ))}
      </AllFiltersSectionWrapper>
    </OptionsMenuWrapper>
  );
};

export default withTheme(OptionsMenu);
