export const PIXEL_TYPE_OPTIONS = [{
        value: "BW",
        label: "B&W ",
    },
    {
        value: "Gray",
        label: "Gray ",
    },
    {
        value: "RGB",
        label: "Color ",
    },
];

export const RESOLUTION_OPTIONS = [{
        label: "100",
        value: 100,
    },
    {
        label: "150",
        value: 150,
    },
    {
        label: "200",
        value: 200,
    },
    {
        label: "300",
        value: 300,
    },
];

export const SAVE_FILE_FORM_RULES = {
    title: {
        required: true,
        message: "Please input title",
        trigger: "blur",
    },
    file_type: {
        required: true,
        message: "Please select file type",
        trigger: "blur",
    },
    doc_type: {
        required: true,
        message: "Please select type",
        trigger: "blur",
    },
};

export const FILE_TYPES = [{
        label: "PDF",
        value: "pdf",
    },
    {
        label: "JPG",
        value: "jpg",
    }, ,
    {
        label: "PNG",
        value: "png",
    }, ,
    {
        label: "BMP",
        value: "bmp",
    },
];