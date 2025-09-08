import {MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {useNavigate} from 'react-router';
import {RadioGroup} from 'radix-ui';
import styles from './ProductOptions.module.css';
import {Grid, Box} from '@radix-ui/themes';

export default function ProductOptions({
  options,
}: {
  options: MappedProductOptions[];
}) {
  const navigate = useNavigate();

  return options.map((option) => {
    // If there is only a single value in the option values, don't display the option
    if (option.optionValues.length === 1) return null;

    return (
      <RadioGroup.Root key={option.name}>
        <Grid gap="2">
          <div className="body-small">{option.name}</div>
          <Grid gap="2" justify="start">
            {option.optionValues.map((value) => {
              const {
                name,
                handle,
                variantUriQuery,
                selected,
                available,
                exists,
                isDifferentProduct,
                swatch,
              } = value;

              return (
                <Box key={option.name + name}>
                  <RadioGroup.Item
                    className={styles.ProductOptionsOption}
                    value={value.name}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    {value.name}
                  </RadioGroup.Item>
                </Box>
              );
            })}
          </Grid>
        </Grid>
      </RadioGroup.Root>
    );
  });
}
