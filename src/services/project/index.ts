import { Project } from 'entities/Project/Project';
import { AppDataSource } from 'database/dataSource';
import { Repository } from 'typeorm';

export async function fetchProjects(): Promise<Project[]> {
  const projectRepository: Repository<Project> = await AppDataSource.getRepository(Project);
  return projectRepository
    .createQueryBuilder('project')
    .leftJoinAndSelect('project.results', 'results')
    .leftJoinAndSelect('project.personProjects', 'personProject')
    .leftJoinAndSelect('personProject.person', 'person')
    .getMany();
}

export async function fetchRawProject(projectId: number): Promise<Project> {
  const projectRepository: Repository<Project> = await AppDataSource.getRepository(Project);

  return projectRepository.findOne({
    where: {
      id: projectId,
    },
    select: ['id', 'description', 'sponsor'],
    relations: ['personProjects', 'results'],
  });
}

export async function fetchProjectWithRelations(projectId: number): Promise<Project> {
  const projectRepository: Repository<Project> = await AppDataSource.getRepository(Project);
  return projectRepository
    .createQueryBuilder('project')
    .leftJoinAndSelect('project.results', 'results')
    .leftJoinAndSelect('project.personProjects', 'personProject')
    .leftJoinAndSelect('personProject.person', 'person')
    .where('project.id = :id', {
      id: projectId,
    })
    .getOne();
}

export async function saveProject(project: Project): Promise<Project> {
  const projectRepository: Repository<Project> = await AppDataSource.getRepository(Project);
  return projectRepository.save(project);
}