import {
  Add,
  ChatBubble,
  Create,
  Delete,
  MoreVert,
  QuestionAnswer,
  Remove
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Radio,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import Input from '../../components/Input';
import { useQuiz } from '../../contexts/quizContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createQuiz, getFolder, getQuiz, updateQuiz } from '../../actions';

const multipleChoiceSchema = z.object({
  text: z.string().nonempty('Question title is required'),
  options: z
    .array(z.string().nonempty('Choice is required'))
    .min(1, 'At least one choice is required')
});

const EditMultipleChoiceModal = ({ open, onClose, quiz }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm({ resolver: zodResolver(multipleChoiceSchema) });

  const { updateQuiz } = useQuiz();

  const [choices, setChoices] = useState(['']);
  const [answer, setAnswer] = useState(null);

  const onSubmit = (data) => {
    data.type = 'MULTIPLE';
    data.correct_option = answer;
    if (!Number.isInteger(data.correct_option))
      return toast.error('Please select an answer');
    updateQuiz(quiz.index, data);
    onClose();
  };

  const handleAddChoice = () => {
    const newChoice = '';
    setChoices([...choices, newChoice]);
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = [...choices];
    updatedChoices.splice(index, 1);
    setChoices(updatedChoices);
    const updatedOptions = [...getValues('options')];
    updatedOptions.splice(index, 1);
    setValue('options', updatedOptions);
  };

  const handleSelectAnswer = (index) => {
    setAnswer(index);
  };

  useEffect(() => {
    if (Object.keys(quiz).length) {
      setAnswer(quiz.correct_option);
      setValue('text', quiz.text);
      if (quiz?.options?.length) {
        setChoices(quiz.options);
      }
    }
  }, [quiz.options, quiz.correct_option, quiz.text]);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Edit Multiple Choice Question</DialogTitle>
      <DialogContent sx={{ minWidth: '600px' }}>
        <Box sx={{ pt: 1 }}>
          <Input
            multiline
            size="small"
            label="Question Title"
            {...register('text')}
            errors={errors.text}
          />
        </Box>
        {choices.map((choice, index) => (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', pt: 1 }}
          >
            <Radio
              checked={index === answer}
              onChange={() => handleSelectAnswer(index)}
              sx={{ color: !Number.isInteger(answer) && 'red' }}
            />
            <Input
              size="small"
              label={`Option ${index + 1}`}
              defaultValue={choice}
              {...register(`options[${index}]`)}
              errors={errors.options?.[index]}
            />
            <IconButton onClick={() => handleRemoveChoice(index)}>
              <Remove />
            </IconButton>
          </Box>
        ))}
        <Box sx={{ pt: 1 }}>
          <Button onClick={handleAddChoice}>Add Choice</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

const CreateMultipleChoiceModal = ({ open, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(multipleChoiceSchema) });

  const { addQuiz } = useQuiz();

  const [choices, setChoices] = useState(['']);
  const [answer, setAnswer] = useState(null);

  const onSubmit = (data) => {
    data.type = 'MULTIPLE';
    data.correct_option = answer;
    if (!Number.isInteger(data.correct_option))
      return toast.error('Please select an answer');
    addQuiz(data);
    onClose();
  };

  const handleAddChoice = () => {
    const newChoice = '';
    setChoices([...choices, newChoice]);
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = [...choices];
    updatedChoices.splice(index, 1);
    setChoices(updatedChoices);
  };

  const handleSelectAnswer = (index) => {
    setAnswer(index);
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>New Multiple Choice Question</DialogTitle>
      <DialogContent sx={{ minWidth: '600px' }}>
        <Box sx={{ pt: 1 }}>
          <Input
            multiline
            size="small"
            label="Question Title"
            {...register('text')}
            errors={errors.text}
          />
        </Box>
        {choices.map((choice, index) => (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', pt: 1 }}
          >
            <Radio
              checked={index === answer}
              onChange={() => handleSelectAnswer(index)}
              sx={{ color: !Number.isInteger(answer) && 'red' }}
            />
            <Input
              size="small"
              label={`Option ${index + 1}`}
              defaultValue={choice}
              {...register(`options[${index}]`)}
              errors={errors.options?.[index]}
            />
            <IconButton onClick={() => handleRemoveChoice(index)}>
              <Remove />
            </IconButton>
          </Box>
        ))}
        <Box sx={{ pt: 1 }}>
          <Button onClick={handleAddChoice}>Add Choice</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

const standaloneSchema = z.object({
  text: z.string().nonempty('Question title is required')
});

const EditStandaloneModal = ({ open, onClose, quiz }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({ resolver: zodResolver(standaloneSchema) });

  const { updateQuiz } = useQuiz();

  const onSubmit = (data) => {
    data.type = 'STANDALONE';

    updateQuiz(quiz.index, data);
    onClose();
  };

  useEffect(() => {
    if (Object.keys(quiz).length) {
      setValue('text', quiz.text);
    }
  }, [quiz.text]);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Edit Question</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box sx={{ pt: 1 }}>
          <Input
            size="small"
            label="Question Title"
            errors={errors.text}
            {...register('text')}
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

const CreateStandaloneQuizModal = ({ open, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(standaloneSchema) });

  const { addQuiz } = useQuiz();

  const onSubmit = (data) => {
    data.type = 'STANDALONE';

    addQuiz(data);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>New Question</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box sx={{ pt: 1 }}>
          <Input
            size="small"
            label="Question Title"
            errors={errors.text}
            {...register('text')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

const Question = ({ text, index, type, options, correct_option }) => {
  const [editMultiple, setEditMultiple] = useState(false);
  const [editStandalone, setEditStandalone] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const { removeQuiz } = useQuiz();

  const handleEdit = () => {
    if (type === 'MULTIPLE') return setEditMultiple(true);
    return setEditStandalone(true);
  };

  return (
    <>
      <EditMultipleChoiceModal
        open={editMultiple}
        onClose={() => setEditMultiple(false)}
        quiz={{ text, index, options, correct_option }}
      />
      <EditStandaloneModal
        open={editStandalone}
        onClose={() => setEditStandalone(false)}
        quiz={{ text, index }}
      />
      <Box
        sx={{
          borderRadius: 2,
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
          p: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography fontWeight="bold">
            {index + 1}. {text}
          </Typography>
          <IconButton onClick={handleOpenMenu}>
            <MoreVert />
          </IconButton>
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
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <Create />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => removeQuiz(index)}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
        {(type === 'MULTIPLE' || options?.length) && (
          <Box>
            {options.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <Radio checked={index === correct_option} />
                <Typography>{option}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

const quizSchema = z.object({
  name: z.string().nonempty('Field is required'),
  desc: z.string().nonempty('Field is required')
});

const CreateQuiz = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openStandalone, setOpenStandalone] = useState(false);
  const [openMultipleChoice, setOpenMultipleChoice] = useState(false);
  const open = Boolean(anchorEl);
  const handleOpenAddNew = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddNew = () => {
    setAnchorEl(null);
  };

  const { pathname } = useLocation();

  const { quiz, clearQuiz, setQuiz } = useQuiz();

  const { folderId, quizId } = useParams();

  const folderQuery = useQuery(['folder', folderId], () => getFolder(folderId));
  const quizQuery = useQuery(['quiz', quizId], () => getQuiz(quizId), {
    enabled: pathname.includes('edit-quiz')
  });

  const navigate = useNavigate();

  const quizMutation = useMutation(createQuiz, {
    onSuccess: () => {
      toast.success('Created Quiz');
      clearQuiz();
      navigate(-1);
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });

  const updateQuizMutation = useMutation(updateQuiz, {
    onSuccess: () => {
      toast.success('Updated Quiz');
      clearQuiz();
      navigate(-1);
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({ resolver: zodResolver(quizSchema) });

  const user = JSON.parse(localStorage.getItem('profile'));

  const onSubmit = (data) => {
    data.folder_id_id = folderQuery?.data?.id;
    data.modified_by = user.email;
    data.questions = quiz;

    if (!data.questions.length) return toast.error('Questions are required');

    if (pathname.includes('edit-quiz')) {
      updateQuizMutation.mutate({ quizId, payload: { ...data } });
    } else {
      quizMutation.mutate({ ...data });
    }
  };

  const onCancel = () => {
    clearQuiz();
    navigate(-1);
  };

  useEffect(() => {
    if (pathname.includes('edit-quiz')) {
      setValue('name', quizQuery.data?.name);
      setValue('desc', quizQuery.data?.desc);
      setQuiz(quizQuery.data?.questions);
    }
  }, [pathname, quizQuery.data]);

  return (
    <>
      <CreateStandaloneQuizModal
        open={openStandalone}
        onClose={() => setOpenStandalone(false)}
      />
      <CreateMultipleChoiceModal
        open={openMultipleChoice}
        onClose={() => setOpenMultipleChoice(false)}
      />
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', mb: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleOpenAddNew}
            startIcon={<Add />}
            sx={{ color: 'white' }}
          >
            New
          </Button>
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
            onClose={handleCloseAddNew}
          >
            <MenuItem onClick={() => setOpenMultipleChoice(true)}>
              <ListItemIcon>
                <QuestionAnswer />
              </ListItemIcon>
              <ListItemText>Multiple Choice</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => setOpenStandalone(true)}>
              <ListItemIcon>
                <ChatBubble />
              </ListItemIcon>
              <ListItemText>Question Only</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
        <Stack gap={2}>
          <Input label="Title" {...register('name')} errors={errors.name} />
          <Input
            label="Instructions"
            multiline
            errors={errors.desc}
            {...register('desc')}
          />
        </Stack>
        <Stack gap={2} sx={{ overflow: 'auto', minHeight: '600px', py: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Questions
          </Typography>
          {quiz?.map((q, index) => (
            <Question key={index} {...q} index={index} />
          ))}
        </Stack>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
            py: 2
          }}
        >
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ color: 'white' }}
            onClick={handleSubmit(onSubmit)}
          >
            {pathname.includes('edit-quiz') ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default CreateQuiz;
