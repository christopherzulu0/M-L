import { toast } from "@/components/ui/use-toast";

/**
 * Share content using the Web Share API with fallback to clipboard
 * @param options - Sharing options
 * @returns Promise that resolves when sharing is complete
 */
export async function shareContent(options: {
  title: string;
  text: string;
  url: string;
  fallbackText?: string;
}): Promise<void> {
  const { title, text, url, fallbackText = "Link copied to clipboard!" } = options;

  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url,
      });

      toast({
        title: "Shared successfully",
        description: "Content has been shared",
        duration: 3000,
      });
    } else {
      await copyToClipboard(url, fallbackText);
    }
  } catch (error) {
    console.error('Error sharing:', error);
    // Fallback to clipboard if sharing fails
    await copyToClipboard(url, fallbackText);
  }
}

/**
 * Copy text to clipboard and show a toast notification
 * @param text - Text to copy
 * @param successMessage - Message to show on success
 */
async function copyToClipboard(text: string, successMessage: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Link copied",
      description: successMessage,
      duration: 3000,
    });
  } catch (error) {
    console.error('Failed to copy:', error);
    toast({
      title: "Failed to copy",
      description: "Could not copy the link to clipboard",
      variant: "destructive",
      duration: 3000,
    });
  }
}

/**
 * Share a property with predefined formatting
 * @param propertyId - ID of the property
 * @param title - Property title
 * @param address - Property address
 * @param price - Property price
 */
export function shareProperty(
  propertyId: string | number | undefined,
  title: string,
  address: string,
  price: string
): Promise<void> {
  const shareUrl = propertyId
    ? `${window.location.origin}/listing-single/${propertyId}`
    : window.location.href;

  const shareTitle = `Check out this property: ${title}`;
  const shareText = `${title} - ${address} - ${price}`;

  return shareContent({
    title: shareTitle,
    text: shareText,
    url: shareUrl,
    fallbackText: `Link to ${title} copied to clipboard!`
  });
}
