import { Settings, Project } from './model';
import { v4 } from 'uuid';
import { workspaceToXML } from '../core/blockly/helpers/workspace.helper';
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  doc,
  getDoc,
  collection,
  updateDoc,
  addDoc,
} from 'firebase/firestore';
import { getApp } from 'firebase/app';

export async function fbSaveSettings(uid: string, settings: Settings) {
  const db = firestore();
  const settingDoc = doc(db, 'settings', uid);
  await updateDoc(settingDoc, { ...settings });
}

export async function addProject(project: Project) {
  const db = firestore();
  const projectCollection = collection(db, 'projects');
  project.created = project.created ? project.created : new Date();
  project.updated = new Date();
  project.canShare = false;
  const projectRef = await addDoc(projectCollection, { ...project });

  await saveFile(projectRef.id, project.userId);
  const projectData = await getDoc(projectRef);
  return { projectId: projectRef.id, project: projectData };
}

export async function saveProject(project: Project, projectId: string) {
  const db = firestore();
  const projectRef = doc(db, 'projects', projectId);

  project.created = project.created ? project.created : new Date();
  project.updated = new Date();
  await updateDoc(projectRef, { ...project });

  await saveFile(projectId, project.userId);
}

export async function getProject(projectId: string): Promise<Project> {
  const db = firestore();
  const projectDb = db.collection('projects');
  const project = await projectDb.doc(projectId).get();
  return project.data() as Project;
}

async function saveFile(projectId: string, uid: string) {
  const storage = firestore();
  const storageRef = storage.ref();
  const fileRef = storageRef.child(`${uid}/${projectId}.xml`);
  await fileRef.put(
    new Blob([workspaceToXML()], { type: 'application/xml;charset=utf-8' })
  );
}

export async function saveUserProfile(
  bio: string,
  username: string,
  uid: string
) {
  const db = firestore();
  const profileDb = db.collection('profiles');
  await profileDb.doc(uid).set({ bio, username });
}

export async function getUserProfile(uid: string) {
  const db = firestore();
  const profileDb = db.collection('profiles');
  const profileRef = await profileDb.doc(uid).get();

  if (profileRef.exists) {
    return profileRef.data();
  }

  return { username: '', bio: '' };
}

export async function getFile(projectId: string, uid: string) {
  const storage = firebase.storage();
  const storageRef = storage.ref();
  const fileRef = storageRef.child(`${uid}/${projectId}.xml`);
  const url = await fileRef.getDownloadURL();

  const response = await fetch(url);

  return await response.text();
}

export async function deleteProject(projectId: string, uid: string) {
  const storage = firebase.storage();
  const storageRef = storage.ref();
  const fileRef = storageRef.child(`${uid}/${projectId}.xml`);
  await fileRef.delete();

  const db = firestore();
  const projectDb = db.collection('projects');
  await projectDb.doc(projectId).delete();
}

const firestore = () => {
  return initializeFirestore(getApp(), {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  });
};
