'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from '@/lib/i18n';
import { Play, Edit, Trash2, Youtube, Instagram } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ProjectCardProps {
  id: string;
  topic: string;
  status: 'draft' | 'processing' | 'ready' | 'published';
  thumbnailUrl?: string;
  platforms: string[];
  createdAt: string;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_CONFIG = {
  draft: {
    label: 'Entwurf',
    color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  },
  processing: {
    label: 'In Bearbeitung',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  ready: {
    label: 'Bereit',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  published: {
    label: 'Veröffentlicht',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
};

const PLATFORM_ICONS = {
  youtube: Youtube,
  tiktok: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  instagram: Instagram,
};

export function ProjectCard({
  id,
  topic,
  status,
  thumbnailUrl,
  platforms,
  createdAt,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const { t } = useTranslation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const statusConfig = STATUS_CONFIG[status];
  const isDraft = status === 'draft';
  const isReadyOrPublished = status === 'ready' || status === 'published';

  const formattedDate = format(new Date(createdAt), 'dd. MMM yyyy', {
    locale: de,
  });

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600 transition-all p-0 overflow-hidden group">
        <CardContent className="p-0">
          {/* Thumbnail */}
          <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={topic}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Play className="w-12 h-12 text-zinc-500" />
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Topic */}
            <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
              {topic}
            </h3>

            {/* Meta Info */}
            <div className="flex items-center justify-between mb-4">
              {/* Platforms */}
              <div className="flex items-center gap-2">
                {platforms.map((platform) => {
                  const Icon = PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS];
                  return Icon ? (
                    <div
                      key={platform}
                      className="w-6 h-6 rounded-full bg-zinc-700/50 flex items-center justify-center"
                      title={platform}
                    >
                      <Icon className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                  ) : null;
                })}
              </div>

              {/* Date */}
              <span className="text-xs text-zinc-500">{formattedDate}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isDraft && (
                <Button
                  onClick={onEdit}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-1" />
                  {t('dashboard.continueProject')}
                </Button>
              )}

              {isReadyOrPublished && (
                <Button
                  onClick={onEdit}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {t('common.edit')}
                </Button>
              )}

              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="ghost"
                size="icon-sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>{t('dashboard.deleteDialog.title')}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {t('dashboard.deleteDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
