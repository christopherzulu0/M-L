// Simple script to test the blog API
fetch('/api/blog')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Blog posts fetched successfully:', data);
  })
  .catch(error => {
    console.error('Error fetching blog posts:', error);
  });
