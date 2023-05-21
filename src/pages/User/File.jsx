import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteComment,
  getComments,
  getFile,
  insertComment,
  updateComment
} from '../../actions';
import Loading from '../../components/Loading';
import { ArrowBack, Create, Delete, MoreVert, Send } from '@mui/icons-material';
import Input from '../../components/Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { handleKeyDown } from '../../helpers';

const insertCommentSchema = z.object({
  comment: z.string().nonempty('Field is required')
});

const EditCommentModal = ({ open, onClose, comment }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({ resolver: zodResolver(insertCommentSchema) });

  const user = JSON.parse(localStorage.getItem('profile'));

  const queryClient = useQueryClient();

  const editCommentMutation = useMutation(updateComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('comments');
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });

  const onSubmit = (data) => {
    data.desc = 'desc';
    data.modified_by = user.email;

    editCommentMutation.mutate({
      commentId: comment.commentId,
      fileId: comment.fileId,
      payload: { ...data }
    });
    onClose();
  };

  useEffect(() => {
    setValue('comment', comment?.comment);
  }, [comment.comment]);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      onKeyDown={(e) => handleKeyDown(e, handleSubmit(onSubmit))}
    >
      <DialogTitle>Edit Comment</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box sx={{ pt: 1 }}>
          <Input
            size="small"
            label="Comment"
            {...register('comment')}
            errors={errors.comment}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteCommentModal = ({ open, onClose, commentId }) => {
  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation(deleteComment, {
    onSuccess: () => queryClient.invalidateQueries('comments'),
    onError: () => toast.error('Something went wrong!')
  });

  const onSubmit = () => {
    deleteCommentMutation.mutate(commentId);
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      onKeyDown={(e) => handleKeyDown(e, onSubmit)}
    >
      <DialogTitle>Delete Comment</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Typography>Are you sure you want to delete this comment?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

const Comment = ({ comment, dateCreated, commentId, fileId }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const user = JSON.parse(localStorage.getItem('profile'));
  const isAdmin = user.role === 'ADMIN';

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <EditCommentModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        comment={{ commentId, fileId, comment }}
      />
      <DeleteCommentModal
        commentId={commentId}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      />
      <Box sx={{ boxShadow: 2, p: 2, borderRadius: 2, position: 'relative' }}>
        <Box>
          <Typography>{comment}</Typography>
          <Typography variant="body2" color="gray">
            {moment(dateCreated).format('MMM DD YYYY')}
          </Typography>
        </Box>
        {isAdmin && (
          <IconButton
            onClick={handleOpenMenu}
            sx={{ position: 'absolute', right: 6, top: 18, zIndex: 10 }}
          >
            <MoreVert />
          </IconButton>
        )}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          keepMounted
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => setOpenEdit(true)}>
            <ListItemIcon>
              <Create />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setOpenDelete(true)}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

const File = () => {
  const { fileId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: zodResolver(insertCommentSchema) });

  const fileQuery = useQuery(['file', fileId], () => getFile(fileId));

  const getUri = (file) => {
    return encodeURIComponent(`https://math-eturo.up.railway.app${file}`);
  };

  const user = JSON.parse(localStorage.getItem('profile'));

  const isAdmin = user.role === 'ADMIN';

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];

  const navigate = useNavigate();

  const fileExtension =
    !fileQuery.isLoading &&
    fileQuery.data.file.substring(fileQuery.data.file.lastIndexOf('.'));

  const queryClient = useQueryClient();

  const commentsQuery = useQuery(
    'comments',
    () => getComments(fileQuery.data?.id),
    {
      enabled: fileQuery.isSuccess
    }
  );

  const insertCommentMutation = useMutation(insertComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('comments');
      reset({ comment: null });
    }
  });

  const onSubmit = (data) => {
    (data.desc = 'desc'), (data.modified_by = user.email);

    insertCommentMutation.mutate({
      commentId: fileQuery.data?.id,
      payload: { ...data }
    });
  };

  return (
    <Box py={2}>
      {fileQuery.isLoading ? (
        <Loading />
      ) : (
        <Box>
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBack />}
            sx={{ py: 1, mb: 1, fontWeight: 'bold' }}
          >
            {fileQuery.data.name}
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            {imageExtensions.includes(fileExtension.toLowerCase()) ? (
              <Box
                component="img"
                sx={{ border: '1px solid black', maxWidth: '800px' }}
                src={`https://math-eturo.up.railway.app${fileQuery.data.file}`}
              />
            ) : videoExtensions.includes(fileExtension.toLowerCase()) ? (
              <Box
                component="video"
                sx={{ maxWidth: '800px', border: '1px solid black' }}
                controls
                src={`https://math-eturo.up.railway.app${fileQuery.data.file}`}
              />
            ) : (
              <iframe
                width="100%"
                height="600"
                src={`https://docs.google.com/gview?url=${getUri(
                  fileQuery.data.file
                )}&embedded=true`}
              ></iframe>
            )}
            <Typography mt={2} variant="h6" fontWeight="bold">
              Comments
            </Typography>
            {isAdmin && (
              <Box mt={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Input
                    label="Add Comment"
                    {...register('comment')}
                    errors={errors.comment}
                  />
                  <IconButton onClick={handleSubmit(onSubmit)}>
                    <Send />
                  </IconButton>
                </Box>
              </Box>
            )}
            <Stack gap={2} mt={2}>
              {commentsQuery.isLoading ? (
                <Loading />
              ) : (
                <>
                  {commentsQuery.data?.map((comment) => (
                    <Comment
                      key={comment.public_id}
                      comment={comment.comment}
                      dateCreated={comment.date_created}
                      commentId={comment.public_id}
                      fileId={fileQuery.data?.id}
                    />
                  ))}
                </>
              )}
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default File;
