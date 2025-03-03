import { Heart } from "lucide-react"

export default function Footer () {
    return (
        <div className="border-t mt-6 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="mb-4 md:mb-0">
              Hecho con <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> por Maximo Y Juan Ignacio.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
              <span>·</span>
              <a href="#" className="hover:text-blue-600 transition-colors">Recursos</a>
              <span>·</span>
              <a href="#" className="hover:text-blue-600 transition-colors">Política Privacidad</a>
              <span>·</span>
              <a href="#" className="hover:text-blue-600 transition-colors">Publicar</a>
            </div>
          </div>
    )
}