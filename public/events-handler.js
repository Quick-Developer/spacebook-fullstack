class EventsHandler {
    constructor(postsRepository, postsRenderer) {
        this.postsRepository = postsRepository;
        this.postsRenderer = postsRenderer;
        this.$posts = $(".posts");
    }
    getAllPosts() {
        let self = this;
        $.get('/loadAllPosts', function (data) {
            for (let i = 0; i < data.length; i++) {
                self.postsRepository.addPostFromDB(data[i]);
            }
            self.postsRenderer.renderPosts(self.postsRepository.posts);
            for (let i = 0; i < self.postsRepository.posts.length; i++) {
                self.postsRenderer.renderComments(self.postsRepository.posts, i);
            }
        })
    }
    
    registerAddPost() {
        $('#addpost').on('click', () => {
            let $input = $("#postText");
            if ($input.val() === "") {
                alert("Please enter text!");
            } else {
                let self = this;
                $.post('/addPost', { text: $input.val() }, function (newPost) {
                    self.postsRepository.addPostFromDB(newPost);
                    self.postsRenderer.renderPosts(self.postsRepository.posts);
                    $input.val("");
                })
            }
        });
    }

    registerRemovePost() {
        this.$posts.on('click', '.remove-post', (event) => {
            let index = $(event.currentTarget).closest('.post').index();
            let postId = $(event.currentTarget).closest('.post').data('id');
            let self = this;
            $.ajax({
                method: 'DELETE',
                url: '/deletePost/' + postId,
                success: () => {
                    self.postsRepository.removePost(index);
                    self.postsRenderer.renderPosts(self.postsRepository.posts);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            });
        });
    }

    registerToggleComments() {
        this.$posts.on('click', '.toggle-comments', (event) => {
            let $clickedPost = $(event.currentTarget).closest('.post');
            $clickedPost.find('.comments-container').toggleClass('show');
        });
    }

    registerAddComment() {
        this.$posts.on('click', '.add-comment', (event) => {
            let $comment = $(event.currentTarget).siblings('.comment');
            let $user = $(event.currentTarget).siblings('.name');

            if ($comment.val() === "" || $user.val() === "") {
                alert("Please enter your name and a comment!");
                return;
            }

            let postIndex = $(event.currentTarget).closest('.post').index();
            let postId = $(event.currentTarget).closest('.post').data('id');
            let newComment = { text: $comment.val(), user: $user.val() };
            let self = this;
            $.post('/post/' + postId + '/AddComment', newComment, function (updatedPost) {
                self.postsRepository.addComment(updatedPost, postIndex);
                self.postsRenderer.renderComments(self.postsRepository.posts, postIndex);
                $comment.val("");
                $user.val("");
            })
        });
    }

    registerRemoveComment() {
        this.$posts.on('click', '.remove-comment', (event) => {
            let $commentsList = $(event.currentTarget).closest('.post').find('.comments-list');
            let postIndex = $(event.currentTarget).closest('.post').index();
            let commentIndex = $(event.currentTarget).closest('.comment').index();
            let postId = $(event.currentTarget).closest('.post').data('id');
            let commentId = $(event.currentTarget).closest('.comment').data('id');
            let self = this;
            $.ajax({
                method: 'DELETE',
                url: '/post/' + postId + '/deleteComment/' + commentId,
                success: () => {
                    self.postsRepository.deleteComment(postIndex, commentIndex);
                    self.postsRenderer.renderComments(self.postsRepository.posts, postIndex);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            });
        });
    }
}

export default EventsHandler