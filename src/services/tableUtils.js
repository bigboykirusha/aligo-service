export function formatRegionData(data) {
   return data.map(region => {
      const regionId = region.id;
      const regionSlug = region.translit;

      const regionOption = {
         option: {
            type: 'item',
            value: {
               place: {
                  label: region.title,
                  value: true,
                  type: 'checkbox',
                  contenteditable: false,
               },
               id: {
                  value: regionId,
                  type: 'text',
                  contenteditable: false,
                  select: 'reg',
               },
               textForm: {
                  value: region.prepositional_case,
                  type: 'text',
               },
               translit: {
                  value: regionSlug,
                  type: 'text',
                  contenteditable: false,
               },
               CNC: {
                  value: '',
                  type: 'text',
                  contenteditable: false,
               },
               regionCentr: {
                  value: region.regional_center?.title ?? '',
                  type: 'text',
                  contenteditable: false,
               },
               option: {
                  slot: 'end',
                  contenteditable: false,
                  id: 1,
               },
            },
            code: 'item',
            subitem: true,
         },
         itemRows: (region.cities || []).map(city => ({
            place: {
               label: city.title,
               value: regionId,
               type: 'checkbox',
               contenteditable: false,
            },
            id: {
               value: city.id,
               type: 'text',
               contenteditable: false,
               select: 'city',
            },
            textForm: {
               value: region.prepositional_case,
               type: 'text',
            },
            translit: {
               value: city.translit,
               type: 'text',
               contenteditable: false,
            },
            CNC: {
               value: !!city.is_cnc,
               type: 'checkbox',
               contenteditable: false,
            },
            regionCentr: {
               value: city.is_regional_center || false,
               type: 'radio',
               contenteditable: false,
               name: regionId,
            },
            option: {
               slot: 'end',
               contenteditable: false,
               id: 1,
            },
         })),
      };

      return regionOption;
   });
}

export function formatOnlyRegionData(data) {
   return data.map(region => ({
      place: {
         label: region.title,
         value: true,
         type: 'checkbox',
         contenteditable: false,
      },
      id: {
         value: region.id,
         type: 'text',
         contenteditable: false,
         select: 'city',
      },
      textForm: {
         value: region.prepositional_case || '',
         type: 'text',
      },
      translit: {
         value: region.translit || '',
         type: 'text',
         contenteditable: false,
      },
      CNC: {
         value: '',
         type: 'text',
         contenteditable: false,
      },
      regionCentr: {
         value: region.title || '',
         type: 'text',
         contenteditable: false,
      },
      option: {
         slot: 'end',
         contenteditable: false,
         id: 1,
      },
   }));
}

export function formatCityData(data) {
   return data.map(city => ({
      place: {
         label: city.title,
         value: true,
         type: 'checkbox',
         contenteditable: false,
      },
      id: {
         value: city.id,
         type: 'text',
         contenteditable: false,
         select: 'city',
      },
      textForm: {
         value: city.prepositional_case || '',
         type: 'text',
      },
      translit: {
         value: city.translit || '',
         type: 'text',
         contenteditable: false,
      },
      CNC: {
         value: city.is_cnc,
         type: 'checkbox',
         contenteditable: false,
      },
      regionCentr: {
         value: city.region?.title || '',
         type: 'text',
         contenteditable: false,
      },
      option: {
         slot: 'end',
         contenteditable: false,
         id: 1,
      },
   }));
}

export function transformSearchResults(data) {
   const regions = [];
   const cities = [];

   data.forEach(item => {
      const isRegion = item.is_region === 1;
      const isCity = item.is_city === 1;

      const commonFields = {
         place: {
            label: item.title,
            value: true,
            type: 'checkbox',
            contenteditable: false,
         },
         id: {
            value: item.id,
            type: 'text',
            contenteditable: false,
            select: isRegion ? 'reg' : 'city',
         },
         textForm: {
            value: item.prepositional_case,
            type: 'text',
         },
         translit: {
            value: item.translit,
            type: 'text',
            contenteditable: false,
         },
         CNC: {
            value: !!item.is_cnc,
            type: 'text',
            contenteditable: false,
         },
         regionCentr: {
            value: item.region?.title ?? null,
            type: 'text',
            contenteditable: false,
         },
         option: {
            slot: 'end',
            contenteditable: false,
            id: 1,
         },
      };

      if (isRegion) {
         regions.push({
            ...commonFields,
            CNC: {
               value: '',
               type: 'text',
               contenteditable: false,
            },
            regionCentr: {
               value: item.regional_center?.title || '',
               type: 'text',
               contenteditable: false,
            },
         });
      }

      if (isCity) {
         cities.push({
            ...commonFields,
            CNC: {
               value: item.is_cnc || false,
               type: 'checkbox',
               contenteditable: false,
            },
            regionCentr: {
               value: item.is_regional_center ? item.region?.title || '' : '',
               type: 'text',
               contenteditable: false,
            },
         });
      }
   });

   const result = [];

   if (regions.length) {
      result.push({
         option: { type: 'header', value: 'Регионы', code: 'reg' },
         itemRows: regions,
      });
   }

   if (cities.length) {
      result.push({
         option: { type: 'header', value: 'Города', code: 'city' },
         itemRows: cities,
      });
   }

   return result;
}