import React, { useEffect, useState } from "react";
import { TextField, Autocomplete, Box, CircularProgress, styled, InputAdornment } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';
import {selectAllCountries, fetchCountries} from './countrySlice';

const CountryTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#5800ff',
    },
  },
});

const DropdownOption = styled(Box)({
  '&:hover': {
    color: '#5800ff'
  }
})

export const CountryDropdown = () => {
  const [selectedCountry, setSelectedCountry] = useState();
  const countries = useSelector(selectAllCountries);
  const status = useSelector((state) => state.countries.status)
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCountries())
    }
  }, [status, dispatch])

  if (status === 'loading') {
    return <CircularProgress />
  }

  return (
    <Autocomplete
      disablePortal
      data-testid="autocomplete"
      id="country-dropdown"
      options={countries}
      autoSelect
      clearIcon={null}
      onChange={(_e, value) => setSelectedCountry(value)}
      handleHomeEndKeys
      sx={{ width: 300 }}
      renderInput={(params) => <CountryTextField {...params} placeholder={"Select"} InputLabelProps={{shrink: false}} InputProps={{
        ...params.InputProps,
        startAdornment: <InputAdornment sx={{margin: '0px 0px 0px 8px'}} position="start">{selectedCountry?.flag ?? ''}</InputAdornment>,
      }} />}
      renderOption={(props, option) => (
        <DropdownOption component="li" {...props}>
          {option.flag} {option.label}
        </DropdownOption>
      )}
    />
  );
};
