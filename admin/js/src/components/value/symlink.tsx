import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { EditNonnullValueProps, NonNullValueProps } from '../common';
import PathField from '../PathField';

const viewStyles = (theme: Theme) => createStyles({
	root: {
		color: theme.onlineconf.palette.symlink,
		textDecoration: 'none',
	},
});

const SymlinkValueView = (props: NonNullValueProps & WithStyles<typeof viewStyles>) => (
	<a className={props.classes.root} href={'/#' + props.value} onClick={event => event.stopPropagation()}>{props.value}</a>
);

const SymlinkValueEdit = (props: EditNonnullValueProps) => {
	const { t } = useTranslation();
	return (
		<PathField {...props} label={t('param.value')} symlink="resolve" fullWidth variant="outlined" margin="dense"/>
	);
};

const SymlinkValueViewStyled = withStyles(viewStyles)(SymlinkValueView);

export default {
	preview: SymlinkValueViewStyled,
	view: SymlinkValueViewStyled,
	edit: SymlinkValueEdit,
};
