/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  "./pages/**/*.{ts,tsx}",
	  "./components/**/*.{ts,tsx}",
	  "./app/**/*.{ts,tsx}",
	  "./src/**/*.{ts,tsx}",
	  "*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {
		colors: {
		  // Colores principales inspirados en el mar patagónico
		  primary: {
			DEFAULT: "#1A5F7A", // Azul profundo del Golfo Nuevo
			foreground: "#FFFFFF",
		  },
		  secondary: {
			DEFAULT: "#86B6C6", // Azul claro de aguas costeras
			foreground: "#1A1A1A",
		  },
		  // Colores de acento inspirados en la naturaleza y cultura local
		  accent: {
			DEFAULT: "#D17842", // Ocre rojizo de la meseta patagónica
			foreground: "#FFFFFF",
		  },
		  // Color que representa la industria del aluminio (Aluar)
		  industrial: {
			DEFAULT: "#7D8491", // Gris metálico del aluminio
			foreground: "#FFFFFF",
		  },
		  // Color que representa la fauna marina (ballenas)
		  marine: {
			DEFAULT: "#2E3A59", // Azul oscuro de las profundidades marinas
			foreground: "#FFFFFF",
		  },
		  // Color que representa la herencia galesa
		  heritage: {
			DEFAULT: "#557B83", // Verde-azulado de las colinas galesas
			foreground: "#FFFFFF",
		  },
		  // Colores de interfaz estándar
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		},
		backgroundImage: {
		  "ocean-gradient": "linear-gradient(to right, #1A5F7A, #86B6C6)", // Gradiente del mar patagónico
		  "coastal-gradient": "linear-gradient(to right, #D17842, #E8C07D)", // Gradiente de la costa y arena
		  "heritage-gradient": "linear-gradient(to right, #557B83, #86B6C6)", // Gradiente de herencia galesa
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		keyframes: {
		  "accordion-down": {
			from: { height: 0 },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: 0 },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  }
  
  