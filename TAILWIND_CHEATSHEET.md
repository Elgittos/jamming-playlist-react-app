# Tailwind CSS Cheatsheet

## Background Colors

### Basic Colors
```css
bg-black          /* Black background */
bg-white          /* White background */
bg-gray-500       /* Gray (50-950 scale) */
bg-red-500        /* Red (50-950 scale) */
bg-blue-500       /* Blue (50-950 scale) */
bg-green-500      /* Green (50-950 scale) */
bg-yellow-500     /* Yellow (50-950 scale) */
bg-purple-500     /* Purple (50-950 scale) */
bg-pink-500       /* Pink (50-950 scale) */
bg-indigo-500     /* Indigo (50-950 scale) */
```

### Opacity
```css
bg-opacity-0      /* 0% opacity */
bg-opacity-25     /* 25% opacity */
bg-opacity-50     /* 50% opacity */
bg-opacity-75     /* 75% opacity */
bg-opacity-100    /* 100% opacity */
```

### Transparent
```css
bg-transparent    /* Transparent background */
```

---

## Container

### Responsive Container
```css
container         /* Responsive max-width container */
```

**Usage:**
```jsx
<div className="container mx-auto">       {/* Centered container */}
<div className="container mx-auto px-4">  {/* Centered with padding */}
```

**Responsive Max-Widths:**
- Default: `max-width: 100%`
- `sm` (640px): `max-width: 640px`
- `md` (768px): `max-width: 768px`
- `lg` (1024px): `max-width: 1024px`
- `xl` (1280px): `max-width: 1280px`
- `2xl` (1536px): `max-width: 1536px`

**Note:** Container doesn't center by itself - use `mx-auto` to center it!

---

## Flexbox Container

### Display
```css
flex              /* display: flex */
inline-flex       /* display: inline-flex */
```

### Direction
```css
flex-row          /* flex-direction: row */
flex-row-reverse  /* flex-direction: row-reverse */
flex-col          /* flex-direction: column */
flex-col-reverse  /* flex-direction: column-reverse */
```

### Wrap
```css
flex-wrap         /* flex-wrap: wrap */
flex-wrap-reverse /* flex-wrap: wrap-reverse */
flex-nowrap       /* flex-wrap: nowrap */
```

### Justify Content (Horizontal Alignment)
```css
justify-start     /* justify-content: flex-start */
justify-end       /* justify-content: flex-end */
justify-center    /* justify-content: center */
justify-between   /* justify-content: space-between */
justify-around    /* justify-content: space-around */
justify-evenly    /* justify-content: space-evenly */
```

### Align Items (Vertical Alignment)
```css
items-start       /* align-items: flex-start */
items-end         /* align-items: flex-end */
items-center      /* align-items: center */
items-baseline    /* align-items: baseline */
items-stretch     /* align-items: stretch */
```

---

## Grid Container

### Display
```css
grid              /* display: grid */
inline-grid       /* display: inline-grid */
```

### Grid Template Columns
```css
grid-cols-1       /* grid-template-columns: repeat(1, minmax(0, 1fr)) */
grid-cols-2       /* grid-template-columns: repeat(2, minmax(0, 1fr)) */
grid-cols-3       /* grid-template-columns: repeat(3, minmax(0, 1fr)) */
grid-cols-4       /* grid-template-columns: repeat(4, minmax(0, 1fr)) */
grid-cols-6       /* grid-template-columns: repeat(6, minmax(0, 1fr)) */
grid-cols-12      /* grid-template-columns: repeat(12, minmax(0, 1fr)) */
grid-cols-none    /* grid-template-columns: none */
```

### Grid Template Rows
```css
grid-rows-1       /* grid-template-rows: repeat(1, minmax(0, 1fr)) */
grid-rows-2       /* grid-template-rows: repeat(2, minmax(0, 1fr)) */
grid-rows-3       /* grid-template-rows: repeat(3, minmax(0, 1fr)) */
grid-rows-4       /* grid-template-rows: repeat(4, minmax(0, 1fr)) */
grid-rows-6       /* grid-template-rows: repeat(6, minmax(0, 1fr)) */
grid-rows-none    /* grid-template-rows: none */
```

### Grid Column Span (for child elements)
```css
col-span-1        /* grid-column: span 1 / span 1 */
col-span-2        /* grid-column: span 2 / span 2 */
col-span-3        /* grid-column: span 3 / span 3 */
col-span-4        /* grid-column: span 4 / span 4 */
col-span-6        /* grid-column: span 6 / span 6 */
col-span-full     /* grid-column: 1 / -1 */
```

### Grid Row Span (for child elements)
```css
row-span-1        /* grid-row: span 1 / span 1 */
row-span-2        /* grid-row: span 2 / span 2 */
row-span-3        /* grid-row: span 3 / span 3 */
row-span-full     /* grid-row: 1 / -1 */
```

### Grid Auto Flow
```css
grid-flow-row     /* grid-auto-flow: row */
grid-flow-col     /* grid-auto-flow: column */
grid-flow-dense   /* grid-auto-flow: dense */
```

### Justify Items (Horizontal Alignment of Items)
```css
justify-items-start    /* justify-items: start */
justify-items-end      /* justify-items: end */
justify-items-center   /* justify-items: center */
justify-items-stretch  /* justify-items: stretch */
```

### Align Items (Vertical Alignment of Items)
```css
items-start       /* align-items: start */
items-end         /* align-items: end */
items-center      /* align-items: center */
items-stretch     /* align-items: stretch */
```

### Place Items (Both Horizontal & Vertical)
```css
place-items-start   /* place-items: start */
place-items-end     /* place-items: end */
place-items-center  /* place-items: center */
place-items-stretch /* place-items: stretch */
```

---

## Gap (Flex & Grid)

### Gap (Space Between Items)
```css
gap-0            /* gap: 0px */
gap-px           /* gap: 1px */
gap-0.5          /* gap: 0.125rem (2px) */
gap-1            /* gap: 0.25rem (4px) */
gap-2            /* gap: 0.5rem (8px) */
gap-3            /* gap: 0.75rem (12px) */
gap-4            /* gap: 1rem (16px) */
gap-5            /* gap: 1.25rem (20px) */
gap-6            /* gap: 1.5rem (24px) */
gap-8            /* gap: 2rem (32px) */
gap-10           /* gap: 2.5rem (40px) */
gap-12           /* gap: 3rem (48px) */
gap-16           /* gap: 4rem (64px) */
```

### Gap X (Horizontal Gap)
```css
gap-x-0          /* column-gap: 0px */
gap-x-1          /* column-gap: 0.25rem (4px) */
gap-x-2          /* column-gap: 0.5rem (8px) */
gap-x-4          /* column-gap: 1rem (16px) */
gap-x-6          /* column-gap: 1.5rem (24px) */
gap-x-8          /* column-gap: 2rem (32px) */
```

### Gap Y (Vertical Gap)
```css
gap-y-0          /* row-gap: 0px */
gap-y-1          /* row-gap: 0.25rem (4px) */
gap-y-2          /* row-gap: 0.5rem (8px) */
gap-y-4          /* row-gap: 1rem (16px) */
gap-y-6          /* row-gap: 1.5rem (24px) */
gap-y-8          /* row-gap: 2rem (32px) */
```

**Note:** Gap works with both Flexbox and Grid containers!

---

## Padding

### All Sides
```css
p-0              /* padding: 0px */
p-1              /* padding: 0.25rem (4px) */
p-2              /* padding: 0.5rem (8px) */
p-3              /* padding: 0.75rem (12px) */
p-4              /* padding: 1rem (16px) */
p-5              /* padding: 1.25rem (20px) */
p-6              /* padding: 1.5rem (24px) */
p-8              /* padding: 2rem (32px) */
p-10             /* padding: 2.5rem (40px) */
p-12             /* padding: 3rem (48px) */
```

### Horizontal (Left & Right)
```css
px-0             /* padding-left & right: 0px */
px-1             /* padding-left & right: 0.25rem */
px-2             /* padding-left & right: 0.5rem */
px-4             /* padding-left & right: 1rem */
px-6             /* padding-left & right: 1.5rem */
px-8             /* padding-left & right: 2rem */
```

### Vertical (Top & Bottom)
```css
py-0             /* padding-top & bottom: 0px */
py-1             /* padding-top & bottom: 0.25rem */
py-2             /* padding-top & bottom: 0.5rem */
py-4             /* padding-top & bottom: 1rem */
py-6             /* padding-top & bottom: 1.5rem */
py-8             /* padding-top & bottom: 2rem */
```

### Individual Sides
```css
pt-4             /* padding-top: 1rem */
pr-4             /* padding-right: 1rem */
pb-4             /* padding-bottom: 1rem */
pl-4             /* padding-left: 1rem */
```

---

## Margin

### All Sides
```css
m-0              /* margin: 0px */
m-1              /* margin: 0.25rem (4px) */
m-2              /* margin: 0.5rem (8px) */
m-3              /* margin: 0.75rem (12px) */
m-4              /* margin: 1rem (16px) */
m-5              /* margin: 1.25rem (20px) */
m-6              /* margin: 1.5rem (24px) */
m-8              /* margin: 2rem (32px) */
m-10             /* margin: 2.5rem (40px) */
m-12             /* margin: 3rem (48px) */
m-auto           /* margin: auto */
```

### Horizontal (Left & Right)
```css
mx-0             /* margin-left & right: 0px */
mx-1             /* margin-left & right: 0.25rem */
mx-2             /* margin-left & right: 0.5rem */
mx-4             /* margin-left & right: 1rem */
mx-auto          /* margin-left & right: auto (center) */
```

### Vertical (Top & Bottom)
```css
my-0             /* margin-top & bottom: 0px */
my-1             /* margin-top & bottom: 0.25rem */
my-2             /* margin-top & bottom: 0.5rem */
my-4             /* margin-top & bottom: 1rem */
my-6             /* margin-top & bottom: 1.5rem */
my-8             /* margin-top & bottom: 2rem */
```

### Individual Sides
```css
mt-4             /* margin-top: 1rem */
mr-4             /* margin-right: 1rem */
mb-4             /* margin-bottom: 1rem */
ml-4             /* margin-left: 1rem */
```

### Negative Margins
```css
-m-1             /* margin: -0.25rem */
-m-2             /* margin: -0.5rem */
-mt-4            /* margin-top: -1rem */
-ml-2            /* margin-left: -0.5rem */
```

---

## Width & Height

### Width
```css
w-0              /* width: 0px */
w-1              /* width: 0.25rem (4px) */
w-2              /* width: 0.5rem (8px) */
w-4              /* width: 1rem (16px) */
w-8              /* width: 2rem (32px) */
w-16             /* width: 4rem (64px) */
w-32             /* width: 8rem (128px) */
w-64             /* width: 16rem (256px) */
w-auto           /* width: auto */
w-1/2            /* width: 50% */
w-1/3            /* width: 33.333333% */
w-2/3            /* width: 66.666667% */
w-1/4            /* width: 25% */
w-3/4            /* width: 75% */
w-full           /* width: 100% */
w-screen         /* width: 100vw */
```

### Min Width
```css
min-w-0          /* min-width: 0px */
min-w-full       /* min-width: 100% */
min-w-min        /* min-width: min-content */
min-w-max        /* min-width: max-content */
min-w-fit        /* min-width: fit-content */
```

### Max Width
```css
max-w-xs         /* max-width: 320px */
max-w-sm         /* max-width: 384px */
max-w-md         /* max-width: 448px */
max-w-lg         /* max-width: 512px */
max-w-xl         /* max-width: 576px */
max-w-2xl        /* max-width: 672px */
max-w-3xl        /* max-width: 768px */
max-w-4xl        /* max-width: 896px */
max-w-5xl        /* max-width: 1024px */
max-w-6xl        /* max-width: 1152px */
max-w-7xl        /* max-width: 1280px */
max-w-full       /* max-width: 100% */
max-w-screen-sm  /* max-width: 640px */
max-w-screen-md  /* max-width: 768px */
max-w-screen-lg  /* max-width: 1024px */
max-w-screen-xl  /* max-width: 1280px */
max-w-screen-2xl /* max-width: 1536px */
max-w-none       /* max-width: none */
```

### Height
```css
h-0              /* height: 0px */
h-1              /* height: 0.25rem (4px) */
h-2              /* height: 0.5rem (8px) */
h-4              /* height: 1rem (16px) */
h-8              /* height: 2rem (32px) */
h-16             /* height: 4rem (64px) */
h-32             /* height: 8rem (128px) */
h-64             /* height: 16rem (256px) */
h-auto           /* height: auto */
h-full           /* height: 100% */
h-screen         /* height: 100vh */
```

### Min Height
```css
min-h-0          /* min-height: 0px */
min-h-full       /* min-height: 100% */
min-h-screen     /* min-height: 100vh */
min-h-min        /* min-height: min-content */
min-h-max        /* min-height: max-content */
min-h-fit        /* min-height: fit-content */
```

### Max Height
```css
max-h-0          /* max-height: 0px */
max-h-1          /* max-height: 0.25rem (4px) */
max-h-2          /* max-height: 0.5rem (8px) */
max-h-4          /* max-height: 1rem (16px) */
max-h-8          /* max-height: 2rem (32px) */
max-h-16         /* max-height: 4rem (64px) */
max-h-32         /* max-height: 8rem (128px) */
max-h-64         /* max-height: 16rem (256px) */
max-h-full       /* max-height: 100% */
max-h-screen     /* max-height: 100vh */
max-h-none       /* max-height: none */
```

---

## Overflow

### Overflow (All Directions)
```css
overflow-auto       /* overflow: auto */
overflow-hidden     /* overflow: hidden */
overflow-clip       /* overflow: clip */
overflow-visible    /* overflow: visible */
overflow-scroll     /* overflow: scroll */
```

### Overflow X (Horizontal)
```css
overflow-x-auto     /* overflow-x: auto (scroll if needed) */
overflow-x-hidden   /* overflow-x: hidden */
overflow-x-clip     /* overflow-x: clip */
overflow-x-visible  /* overflow-x: visible */
overflow-x-scroll   /* overflow-x: scroll (always show scrollbar) */
```

### Overflow Y (Vertical)
```css
overflow-y-auto     /* overflow-y: auto (scroll if needed) */
overflow-y-hidden   /* overflow-y: hidden */
overflow-y-clip     /* overflow-y: clip */
overflow-y-visible  /* overflow-y: visible */
overflow-y-scroll   /* overflow-y: scroll (always show scrollbar) */
```

### Scroll Behavior
```css
scroll-smooth       /* scroll-behavior: smooth */
scroll-auto         /* scroll-behavior: auto */
```

### Common Use Cases
```jsx
// Horizontal scrolling cards
<div className="flex overflow-x-auto gap-4">

// Scrollable content area
<div className="overflow-y-auto max-h-96">

// Hide overflow completely
<div className="overflow-hidden">

// Both directions scrollable
<div className="overflow-auto max-h-screen">
```

---

## Text Size

### Font Sizes
```css
text-xs          /* font-size: 0.75rem (12px) */
text-sm          /* font-size: 0.875rem (14px) */
text-base        /* font-size: 1rem (16px) */
text-lg          /* font-size: 1.125rem (18px) */
text-xl          /* font-size: 1.25rem (20px) */
text-2xl         /* font-size: 1.5rem (24px) */
text-3xl         /* font-size: 1.875rem (30px) */
text-4xl         /* font-size: 2.25rem (36px) */
text-5xl         /* font-size: 3rem (48px) */
text-6xl         /* font-size: 3.75rem (60px) */
text-7xl         /* font-size: 4.5rem (72px) */
text-8xl         /* font-size: 6rem (96px) */
text-9xl         /* font-size: 8rem (128px) */
```

### Font Weight
```css
font-thin        /* font-weight: 100 */
font-extralight  /* font-weight: 200 */
font-light       /* font-weight: 300 */
font-normal      /* font-weight: 400 */
font-medium      /* font-weight: 500 */
font-semibold    /* font-weight: 600 */
font-bold        /* font-weight: 700 */
font-extrabold   /* font-weight: 800 */
font-black       /* font-weight: 900 */
```

### Text Color
```css
text-black       /* Black text */
text-white       /* White text */
text-gray-500    /* Gray text (50-950 scale) */
text-red-500     /* Red text (50-950 scale) */
text-blue-500    /* Blue text (50-950 scale) */
```

### Text Alignment
```css
text-left        /* text-align: left */
text-center      /* text-align: center */
text-right       /* text-align: right */
text-justify     /* text-align: justify */
```

---

## Quick Example

```jsx
<div className="flex flex-col items-center justify-center bg-blue-500 p-8 m-4">
  <h1 className="text-4xl font-bold text-white mb-4">Hello Tailwind</h1>
  <p className="text-lg text-gray-200 px-6 py-2">
    A quick example combining all utilities
  </p>
</div>
```

---

## Tips

- Color scales range from 50 (lightest) to 950 (darkest)
- Spacing scale: 1 = 0.25rem (4px), 2 = 0.5rem (8px), 4 = 1rem (16px), etc.
- Use `hover:`, `focus:`, `active:` prefixes for states (e.g., `hover:bg-blue-600`)
- Use responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:` (e.g., `md:text-2xl`)
- Combine utilities with spaces: `className="flex items-center gap-4 p-6"`
