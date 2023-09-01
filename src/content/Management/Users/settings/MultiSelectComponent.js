import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import CircularProgress from '@mui/material';
// import CommonTextField from './CommonTextField';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import TextField from '@material-ui/core/TextField';

export default function MultiSelectComponent(props) {
  const {
    options,
    noOptionsText,
    onInputChange,
    errorText,
    disabled,
    InputProps,
    ...restProps
  } = props;

  return (
    <Autocomplete
      options={options}
      multiple={true}
      noOptionsText={noOptionsText}
      // renderOption={option => <React.Fragment>{option}</React.Fragment>}
      ChipProps={{ color: 'primary' }}
      renderInput={params => {
        return (
          <TextField
            {...params}
            variant="outlined"
            label={props.label}
            disabled={disabled}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {props.loading ? (
                    <CircularProgress color="primary" size={20} />
                  ) : null}
                  {disabled ? '' : params.InputProps.endAdornment}
                </React.Fragment>
              ),
              ...InputProps
            }}
          />
        );
      }}
      disableCloseOnSelect
      onInputChange={onInputChange}
      filterOptions={options => options}
      {...restProps}
    />
  );
}
