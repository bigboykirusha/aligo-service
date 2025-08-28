export default {
  main: [
    {
      redact: { slot: 'start', contenteditable: false, id: 1 },
      id: {
        value: 'id1',
        text: null,
        type: 'status',
        isActiv: false,
        contenteditable: false,
      },

      option: {
        slot: 'end',
        items: ['Марка', 'Цвет', 'Электроника'],
        contenteditable: false,
        id: 1,
      },
    },
    {
      redact: { slot: 'start', contenteditable: false, id: 1 },
      id: {
        value: 'id2',
        text: 'Изм. 11.12.24|15:23',
        type: 'status',
        isActiv: true,
        contenteditable: false,
      },

      option: {
        slot: 'end',
        items: ['Марка', 'Цвет', 'Электроника'],
        contenteditable: false,
        id: 1,
      },
    },
  ],

  filterSrch: [
    {
      option: { type: 'header', value: 'Марка', code: 'Mark' },
      itemRows: [
        {
          redact: { slot: 'start', contenteditable: false, id: 1 },
          id: {
            value: 'id1',
            text: null,
            type: 'status',
            isActiv: false,
            contenteditable: false,
          },

          option: {
            slot: 'end',
            items: ['Марка', 'Цвет', 'Электроника'],
            contenteditable: false,
            id: 1,
          },
        },
        {
          redact: { slot: 'start', contenteditable: false, id: 1 },
          id: {
            value: 'id1',
            text: null,
            type: 'status',
            isActiv: false,
            contenteditable: false,
          },

          option: {
            slot: 'end',
            items: ['Марка', 'Цвет', 'Электроника'],
            contenteditable: false,
            id: 1,
          },
        },
        {
          redact: { slot: 'start', contenteditable: false, id: 1 },
          id: {
            value: 'id1',
            text: null,
            type: 'status',
            isActiv: false,
            contenteditable: false,
          },

          option: {
            slot: 'end',
            items: ['Марка', 'Цвет', 'Электроника'],
            contenteditable: false,
            id: 1,
          },
        },
      ],
    },
    {
      option: { type: 'header', value: 'Цвет', code: 'Color' },
      itemRows: [
        {
          redact: { slot: 'start', contenteditable: false, id: 1 },
          id: {
            value: 'id2',
            text: 'Изм. 11.12.24|15:23',
            type: 'status',
            isActiv: true,
            contenteditable: false,
          },

          option: {
            slot: 'end',
            items: ['Марка', 'Цвет', 'Электроника'],
            contenteditable: false,
            id: 1,
          },
        },
        {
          redact: { slot: 'start', contenteditable: false, id: 1 },
          id: {
            value: 'id2',
            text: 'Изм. 11.12.24|15:23',
            type: 'status',
            isActiv: true,
            contenteditable: false,
          },

          option: {
            slot: 'end',
            items: ['Марка', 'Цвет', 'Электроника'],
            contenteditable: false,
            id: 1,
          },
        },
        {
          redact: { slot: 'start', contenteditable: false, id: 1 },
          id: {
            value: 'id2',
            text: 'Изм. 11.12.24|15:23',
            type: 'status',
            isActiv: true,
            contenteditable: false,
          },

          option: {
            slot: 'end',
            items: ['Марка', 'Цвет', 'Электроника'],
            contenteditable: false,
            id: 1,
          },
        },
      ],
    },
  ],
};
