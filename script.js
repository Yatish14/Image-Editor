const chooseImageButton = document.querySelector(".controls .choose-img");
const  fileInput = document.querySelector(".controls .file-input");
const previewImage = document.querySelector(".preview-img img");
const containerClass = document.querySelector(".container");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterSlider = document.querySelector(".slider input");
const filterValue = document.querySelector(".filter-info .value");
const rotateOptions = document.querySelectorAll(".rotate button");
const resetFilterButton = document.querySelector(".controls .reset-filter");
const saveImageButton = document.querySelector(".save-img");

let brightness = 100,saturation = 100,grayscale = 0,inversion = 0,rotate = 0,flipHorizontal = 1,flipVertical = 1;

const applyFilters = () => {
    previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal},${flipVertical})`;
    previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

filterOptions.forEach( option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;
        if(option.id === "brightness")
        {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        }
        else if(option.id === "saturation")
        {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        }
        else if(option.id === "inversion")
        {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }
        else
        {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        console.log("clicked");
        if(option.id === "left")
        {
            rotate -= 90;
        }
        else if(option.id === "right")
        {
            rotate += 90;
        }
        else if(option.id === "horizontal")
        {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }
        else
        {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    });
});

fileInput.addEventListener("change",() => {
    let file = fileInput.files[0];
    if(!file) return;
    previewImage.src = URL.createObjectURL(file);
    previewImage.addEventListener("load",() => {
        resetFilterButton.click();
        containerClass.classList.remove("disable")
    });
});


filterSlider.addEventListener("input",() => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");
    if(selectedFilter.id === "brightness")
    {
        brightness = filterSlider.value;
    }
    else if(selectedFilter.id === "saturation")
    {
        saturation = filterSlider.value;
    }
    else if(selectedFilter.id === "inversion")
    {
        inversion = filterSlider.value;
    }
    else
    {
        grayscale = filterSlider.value;
    }
    applyFilters();
});


chooseImageButton.addEventListener("click",() => fileInput.click());

resetFilterButton.addEventListener("click",() => {
    brightness = 100;
    saturation = 100;
    grayscale = 0;
    inversion = 0;
    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    filterOptions[0].click();
    applyFilters();
});

saveImageButton.addEventListener("click",() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;
    context.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    context.translate(canvas.width/2,canvas.height/2);
    if(rotate !== 0)
    {
        context.rotate(rotate * Math.PI/180);
    }
    context.scale(flipHorizontal,flipVertical);
    context.drawImage(previewImage,-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
});
