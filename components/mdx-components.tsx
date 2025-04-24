import { Button } from "./ui/button"
import { Alert } from "./ui/alert"

export const components = {
  h1: (props) => <h1 className="text-4xl font-bold mb-4" {...props} />,
  h2: (props) => <h2 className="text-3xl font-bold mb-3" {...props} />,
  p: (props) => <p className="mb-4 text-gray-600" {...props} />,
  Button,
  Alert,
}
