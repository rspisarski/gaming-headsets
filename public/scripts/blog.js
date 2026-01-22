document.addEventListener('DOMContentLoaded', () => {
  const loadMoreBtn = document.getElementById('load-more');
  const postsContainer = document.getElementById('blog-posts');
  
  const POSTS_PER_PAGE = 6;
  let currentPage = 1;
  const allPosts = Array.from(postsContainer.children);
  
  function updatePostsVisibility() {
    const visiblePosts = currentPage * POSTS_PER_PAGE;
    allPosts.forEach((post, index) => {
      if (index < visiblePosts) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
    
    if (visiblePosts >= allPosts.length) {
      loadMoreBtn.style.display = 'none';
    }
  }
  
  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    updatePostsVisibility();
  });
  
  updatePostsVisibility();
});
